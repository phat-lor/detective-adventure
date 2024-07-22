import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Rt = Refresh Token
/**
 * RtStrategy class is responsible for handling the JWT refresh token strategy for authentication.
 */
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRECT,
      passReqToCallback: true,
    });
  }

  private static extractJwtFromCookie(req: Request): string | null {
    if (!req || !req.cookies || !req.cookies.access_token) {
      return null;
    }
    return req.cookies['refresh_token'];
  }

  /**
   * Validates the request and payload for the JWT refresh token strategy.
   * @param req - The request object.
   * @param payload - The payload extracted from the JWT token.
   * @returns An object containing the validated payload and the refresh token.
   */
  validate(req: Request, payload: any) {
    const refreshToken =
      req.cookies['refresh_token'] ??
      req.get('authorization').replace('Bearer ', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
