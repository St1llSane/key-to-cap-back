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
    const user = await this.userService.findUser(email);
    const isPasswordsMatch = await compare(password, user.password);

    if (user && isPasswordsMatch) {
      return user;
    }

    throw new NotFoundError();
  }

  async login(user: any) {
    const { id, email } = user;

    return {
      id,
      email,
      access_token: this.jwtService.sign({
        id,
        email,
      }),
    };
  }
}
