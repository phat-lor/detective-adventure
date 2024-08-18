import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticationDto } from './dto';
import { hash, compare } from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { hash as hashArgon, verify as verifyArgon } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CookieOptions, Response } from 'express';

/**
 * Service responsible for handling authentication-related operations.
 */

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days

  /**
   * Sign up a user with the provided authentication data.
   * @param dto - The authentication data including phoneNumber, username, and password.
   * @returns A promise that resolves to the generated tokens for the newly signed up user.
   * @throws Error if any of the required fields (phoneNumber, username, password) are missing.
   */
  async signupL(dto: AuthenticationDto, res: Response): Promise<Tokens> {
    const { phoneNumber, username, password } = dto;

    if (!phoneNumber || !username || !password) {
      throw new BadRequestException('Missing fields');
    }

    const hashpw = await this.hashShortData(password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          phoneNumber,
          username,
          password: hashpw,
        },
      });

      const tokens = await this.getTokens(newUser.id, newUser.phoneNumber);

      await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);

      return tokens;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ForbiddenException('Username or phoneNumber already exists');
      }
    }

    throw new InternalServerErrorException("Something isn't right");
  }

  /**
   * Sign in a user with the provided authentication credentials.
   * @param dto - The authentication data transfer object.
   * @returns A promise that resolves to an object containing the access and refresh tokens.
   * @throws BadRequestException if any required fields are missing.
   * @throws ForbiddenException if the user or password is invalid.
   */
  async signinL(dto: AuthenticationDto, res: Response): Promise<Tokens> {
    const { phoneNumber, password } = dto;
    if (!phoneNumber || !password) {
      throw new BadRequestException('Missing fields');
    }
    // phoneNumber or username to search for in prisma
    const user = await this.prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invaled phoneNumber or password');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new ForbiddenException('Invaled phoneNumber or password');
    }

    const tokens = await this.getTokens(user.id, user.phoneNumber);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Signs out a user by updating the hashed refresh token to null.
   * @param userId - The ID of the user to sign out.
   */
  async signout(userId: string, res: Response) {
    if (!userId) {
      throw new BadRequestException('Missing fields');
    }
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string, res: Response) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('User or refresh token is invalid');
    }

    const valid = await verifyArgon(user.hashedRt, rt);
    if (!valid) {
      throw new ForbiddenException('User or refresh token is invalid');
    }

    const tokens = await this.getTokens(user.id, user.phoneNumber);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Hashes the provided data using a specified number of rounds.
   * @param data The data to be hashed.
   * @returns The hashed data.
   */
  hashShortData(data: string) {
    return hash(data, 10);
  }

  /**
   * Hashes long data using Argon algorithm.
   * @param data The data to be hashed.
   * @returns The hashed data.
   */
  hashLongData(data: string) {
    return hashArgon(data);
  }

  /**
   * Updates the refresh token hash for a user.
   * @param userId - The ID of the user.
   * @param refreshToken - The refresh token to be hashed and updated.
   * @returns A promise that resolves when the refresh token hash is updated.
   */
  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.hashLongData(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  /**
   * Retrieves the access and refresh tokens for a given user.
   * @param userId - The ID of the user.
   * @param phoneNumber - The phoneNumber of the user.
   * @returns A promise that resolves to an object containing the access and refresh tokens.
   */
  async getTokens(userId: string, phoneNumber: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          phoneNumber,
        },
        {
          secret: process.env.JWT_ACCESS_SECRECT,
          expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          phoneNumber,
        },
        {
          secret: process.env.JWT_REFRESH_SECRECT,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
      expiresIn: new Date().setTime(
        new Date().getTime() + this.ACCESS_TOKEN_EXPIRES_IN * 1000,
      ),
    };
  }

  // ยังไม่ได้ใช้งาน ใช้ในกรณีที่ต้องการเก็บ Token ใน Cookies แทนการเก็บใน LocalStorage แต่ว่าผมถนัดแบบ Local มากกว่า 555
  // setTokensCookies(res: Response, tokens: Tokens) {
  //   res.cookie('access_token', tokens.accessToken, {
  //     ...this.cookieOptions,
  //     maxAge: 60 * 15 * 1000, // 15 minutes
  //   });
  //   res.cookie('refresh_token', tokens.refreshToken, {
  //     ...this.cookieOptions,
  //     maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
  //   });
  // }
}
