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

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private setCookie = (res: Response, access_token: string) => {
    res.cookie('access_token', access_token, {
      // TODO: need to secure in the future
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 1000),
    });
  };

  @Post('auth/register')
  async createUser(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUserInfo = await this.userService.createUser(body);
    const access_token = await this.authService.login(body);

    this.setCookie(res, access_token);

    return newUserInfo;
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(body);

    this.setCookie(res, access_token);

    return null;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
