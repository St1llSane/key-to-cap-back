import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJWT,
        // ExtractJwt.fromHeader('Cookie'),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_JWT_SECRET,
    });
  }

  private static extractJWT(req: Request) {
    if (
      req.cookies &&
      'refresh_token' in req.cookies &&
      req.cookies.refresh_token.length > 0
    ) {
      return req.cookies.refresh_token;
    }

    return null;
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
