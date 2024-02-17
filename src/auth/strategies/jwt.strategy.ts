import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJWT(req: Request) {
    if (
      req.cookies &&
      'acces_token' in req.cookies &&
      req.cookies.acces_token.length > 0
    ) {
      return req.cookies.acces_token;
    }

    return null;
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
