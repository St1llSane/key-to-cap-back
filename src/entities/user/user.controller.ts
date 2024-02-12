import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getUsers();

    return res.send({ status: 'OK', data: users });
  }

  @Get(':id')
  async getUserById(@Param() { id }: { id: string }, @Res() res: Response) {
    const user = await this.userService.getUserById(id);

    if (!user.isActive) {
      return res.send({
        status: 'FAIL',
        data: { message: 'This user does not exist' },
      });
    }

    return res.send({ status: 'OK', data: user });
  }

  @Post('/')
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const newUser = await this.userService.createUser(body);

    // TODO need to think how to make it's clear if user is not exist
    return res.send({ status: 'OK', data: newUser });
  }

  @Put(':id')
  async updateUserById(
    @Param() { id }: { id: string },
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    await this.userService.updateUser(id, body);

    return res.send({ status: 'OK' });
  }

  @Delete(':id')
  async deleteUserById(@Param() { id }: { id: string }, @Res() res: Response) {
    await this.userService.deleteUser(id);

    return res.send({ status: 'OK' });
  }
}
