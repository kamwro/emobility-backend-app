import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { NotFoundException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../utils/types/jwt-payload.type';
import { JwtRefreshPayload } from '../../utils/types/jwt-refresh-payload.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtRefreshPayload {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
