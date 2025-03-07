import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      /* 1. Get accessToken from Cookies */
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return request?.cookies?.accessToken || null;
        }
      ]),
      /* 2. Get accessToken from Authorization Header Bear Token */
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET_SIGNATURE')
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
