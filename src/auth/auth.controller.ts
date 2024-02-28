import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.local-auth.guard';
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

  @Post('auth/sign-up')
  @HttpCode(201)
  async createUser(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUser = await this.userService.createUser(body);

    const { access_token, refresh_token } =
      await this.authService.getJwt(newUser);

    this.setCookie(res, access_token, refresh_token);

    return {
      newUser,
      access_token,
      refresh_token,
    };
  }

  @Post('auth/sign-in')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findUserByEmail(body.email);

    const { access_token, refresh_token } = await this.authService.getJwt(user);

    this.setCookie(res, access_token, refresh_token);

    return { access_token, refresh_token };
  }

  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Res({ passthrough: true }) res: Response) {
    this.setCookie(res, '', '', true);

    return { status: '200' };
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.getJwt(
      req.user as User,
    );

    this.setCookie(res, access_token, refresh_token);

    return { access_token, refresh_token };
  }

  private setCookie = (
    res: Response,
    access_token: string,
    refresh_token: string,
    isReset?: boolean,
  ) => {
    res.cookie('access_token', access_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: isReset
        ? new Date(Date.now())
        : new Date(Date.now() + 60 * 15 * 1000),
      // expires: isReset
      //   ? new Date(Date.now())
      //   : new Date(Date.now() + 15 * 1000),
      maxAge: isReset ? 0 : 60 * 15 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: isReset
        ? new Date(Date.now())
        : new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      maxAge: isReset ? 0 : 60 * 60 * 24 * 7 * 1000,
    });
  };
}
