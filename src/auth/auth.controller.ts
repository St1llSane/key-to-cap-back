import {
  Body,
  Controller,
  Get,
  Param,
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
    access_token: string,
    refresh_token: string,
  ) => {
    res.cookie('access_token', access_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000 * 15),
    });

    res.cookie('refresh_token', refresh_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000 * 60 * 24),
    });
  };

  @Post('auth/register')
  async createUser(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUserInfo = await this.userService.createUser(body);
    const { access_token } = await this.authService.getJwt(body);
    const { refresh_token } = await this.authService.getJwt(body);

    this.setTokensToCookie(res, access_token, refresh_token);

    return { newUserInfo, access_token, refresh_token };
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.getJwt(body);
    // TODO: should automatically login if user has an acces or refresh token
    const { refresh_token } = await this.authService.getJwt(body);

    this.setTokensToCookie(res, access_token, refresh_token);

    return { access_token, refresh_token };
  }

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('id') id: string) {
    const user = this.userService.findUserByEmail(id);

    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.getJwt(
      req.user,
    );

    this.setTokensToCookie(res, access_token, refresh_token);

    return { access_token, refresh_token };
  }
}
