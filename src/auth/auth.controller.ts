import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request, Response } from 'express';
import { CreateUserDto } from '@entities/user/dto/createUser.dto';
import { UserService } from '@entities/user/user.service';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private setTokensToCookie = (
    res: Response,
    access_token?: string,
    refresh_token?: string,
  ) => {
    if (access_token) {
      res.cookie('access_token', access_token, {
        // TODO: need to secure in the future
        secure: false,
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000 * 15),
      });
    }

    if (refresh_token) {
      res.cookie('refresh_token', refresh_token, {
        // TODO: need to secure in the future
        secure: false,
        httpOnly: true,
        expires: new Date(Date.now() + 604800),
      });
    }
  };

  @Post('auth/register')
  async createUser(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUserInfo = await this.userService.createUser(body);
    const access_token = this.authService.getJwt({ user: body });
    // TODO: i can use refresh token as acces token
    const refresh_token = this.authService.getJwt({
      user: body,
      expiresIn: '7d',
    });

    this.setTokensToCookie(res, access_token, refresh_token);

    return { newUserInfo, access_token, refresh_token };
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const access_token = this.authService.getJwt({ user: body });
    // TODO: why refresh_token in login?
    const refresh_token = this.authService.getJwt({
      user: body,
      expiresIn: '7d',
    });

    this.setTokensToCookie(res, access_token, refresh_token);

    return refresh_token;
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // TODO: i can use refresh token as acces token
    const access_token = this.authService.getJwt({ user: req.user });

    this.setTokensToCookie(res, access_token);

    return access_token;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
