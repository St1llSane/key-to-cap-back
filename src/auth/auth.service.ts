import { UserService } from '@entities/user/user.service';
import { NotFoundError } from 'src/shared/errors/NotFoundError';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { TokensStringValues } from 'src/shared/types/enums';

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

  async getJwt({ id, email }: { id: string; email: string }) {
    return {
      access_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: process.env.ACCESS_JWT_SECRET,
          expiresIn: TokensStringValues.ACCESS_TOKEN_EXPIRE_TIME_MINUTES,
        },
      ),
      refresh_token: await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: process.env.REFRESH_JWT_SECRET,
          expiresIn: TokensStringValues.REFRESH_TOKEN_EXPIRE_TIME_DAYS,
        },
      ),
    };
  }
}
