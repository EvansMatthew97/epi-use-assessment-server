import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Check that the provided user exists and that their password
   * matches the provided. If either of these conditions fails,
   * returns null. If successful, returns the user.
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUser(username);

    // check that the user exists
    if (!user) {
      return null;
    }

    // check that the password matches
    const passwordsMatch = await user.validatePassword(password);
    if (!passwordsMatch) {
      return null;
    }

    return user;
  }

  /**
   * Returns a signed jwt token for the given user
   * @param user
   */
  async generateToken(user: User) {
    const payload: JwtPayload = {
      username: user.username,
    };

    return this.jwtService.sign(payload);
  }
}
