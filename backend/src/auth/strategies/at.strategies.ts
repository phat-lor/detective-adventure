import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/users/users.service';
// At = Access Token
/**
 * AtStrategy class is a Passport strategy for authenticating requests using JWT access tokens.
 * It extends the PassportStrategy class and implements the 'jwt' strategy.
 */
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_ACCESS_SECRECT,
    });
  }

  /**
   * Extracts the JWT token from the cookie in the request.
   *
   * @param req - The request object.
   * @returns The JWT token extracted from the cookie, or null if it cannot be extracted.
   */
  private static extractJwtFromCookie(req: Request): string | null {
    if (!req || !req.cookies) {
      return null;
    }
    return req.cookies['access_token'];
  }

  /**
   * Validates the payload of the JWT token.
   * @param payload - The payload of the JWT token.
   * @returns The validated payload.
   */
  async validate(payload: any) {
    // req.user = payload;
    const user = await this.userService.getUserInfoById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userRole = user.role as Role;

    return { ...payload, roles: [userRole] };
  }
}
