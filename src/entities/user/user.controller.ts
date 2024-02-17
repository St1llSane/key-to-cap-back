import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Gel all users' })
  async getAllUsers(@Req() request: Request) {
    const usersInfo = await this.userService.getAllUsers();

    console.log(
      '🚀 ~ UserController ~ getAllUsers ~ request:',
      request.cookies,
    );

    return usersInfo;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gel user by id' })
  async getUserById(@Param('id') id: string) {
    const userInfo = await this.userService.getUserById(id);

    return userInfo;
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async createUser(@Body() body: CreateUserDto) {
    const newUserInfo = await this.userService.createUser(body);

    return newUserInfo;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async updateUserById(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const updatedUserInfo = await this.userService.updateUser(id, body);

    return updatedUserInfo;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  async deleteUserById(@Param('id') id: string) {
    const deletedUserInfo = await this.userService.deleteUser(id);

    return deletedUserInfo;
  }
}
