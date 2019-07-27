import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Logs the user in. Returns a jwt token.
   * @param body
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return {
      token: await this.authService.generateToken(req.user),
    };
  }

  /**
   * Verify that a token is valid without generating a new one.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('verify-token')
  async verifyToken() {
    return true;
  }
}
