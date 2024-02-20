import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request, Response } from 'express';
import { AuthUserDto } from '@entities/user/dto/createUser.dto';
import { UserService } from '@entities/user/user.service';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { User } from '@entities/user/user.entity';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private setTokensToCookie = (
    res: Response,
    access_token: string,
    refresh_token: string,
  ) => {
    res.cookie('access_token', access_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 1000),
      maxAge: 15 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000 * 15),
      maxAge: 60 * 1000 * 15,
    });
  };

  @Post('auth/register')
  async createUser(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUser = await this.userService.createUser(body);

    const { access_token, refresh_token, access_token_expire_time } =
      await this.authService.getJwt(newUser);

    this.setTokensToCookie(res, access_token, refresh_token);

    return {
      newUser,
      access_token,
      refresh_token,
      access_token_expire_time,
    };
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findUserByEmail(body.email);

    const { access_token, refresh_token, access_token_expire_time } =
      await this.authService.getJwt(user);

    this.setTokensToCookie(res, access_token, refresh_token);

    return { access_token, refresh_token, access_token_expire_time };
  }

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('id') id: string) {
    const user = this.userService.findUserByEmail(id);

    return user;
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, access_token_expire_time } =
      await this.authService.getJwt(req.user as User);

    this.setTokensToCookie(res, access_token, refresh_token);

    return { access_token, refresh_token, access_token_expire_time };
  }
}
