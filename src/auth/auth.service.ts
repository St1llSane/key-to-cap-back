import { UserService } from '@entities/user/user.service';
import { NotFoundError } from '@errors/NotFoundError';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    const isPasswordsMatch = await compare(password, user.password);

    if (user && isPasswordsMatch) {
      return user;
    }

    throw new NotFoundError();
  }

  async getJwt(user: any) {
    const { id, email } = user;

    return {
      access_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        { expiresIn: '15m', secret: process.env.ACCESS_JWT_SECRET },
      ),
      refresh_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        { expiresIn: '1d', secret: process.env.REFRESH_JWT_SECRET },
      ),
    };
  }

  async getRefreshJwt(user: any) {
    const { id, email } = user;

    return {
      access_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        { expiresIn: '15m', secret: process.env.ACCESS_JWT_SECRET },
      ),
      refresh_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        { expiresIn: '1d', secret: process.env.REFRESH_JWT_SECRET },
      ),
    };
  }
}
