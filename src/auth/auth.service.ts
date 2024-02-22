import { UserService } from '@entities/user/user.service';
import { NotFoundError } from '@errors/NotFoundError';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/types/types';

const ACCESS_TOKEN_EXPIRE_TIME = 15;
const REFRESH_TOKEN_EXPIRE_TIME = 7;

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

  async getJwt(user: User) {
    const { id, email } = user;

    return {
      access_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: process.env.ACCESS_JWT_SECRET,
          expiresIn: `${ACCESS_TOKEN_EXPIRE_TIME}m`,
        },
      ),
      refresh_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: process.env.REFRESH_JWT_SECRET,
          expiresIn: `${REFRESH_TOKEN_EXPIRE_TIME}d`,
        },
      ),
      access_token_expire_time: new Date().setTime(
        new Date().getTime() + 60 * ACCESS_TOKEN_EXPIRE_TIME * 1000,
      ),
    };
  }
}
