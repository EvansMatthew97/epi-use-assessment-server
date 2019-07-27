import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  /**
   * Determines value passed on.
   * We are guaranteed to only ever have this function called
   * when the token was valid.
   * @param payload
   */
  async validate(payload: any): Promise<JwtPayload> {
    return {
      username: payload.username,
    };
  }
}
