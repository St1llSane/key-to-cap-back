import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers() {
    const usersInfo = await this.userService.getUsers();

    return usersInfo;
  }

  @Get(':id')
  async getUserById(@Param() { id }: { id: string }) {
    const userInfo = await this.userService.getUserById(id);

    if (!userInfo.data.isActive) {
      return {
        status: 'rejected',
        data: { message: 'User with this id does not exist' },
      };
    }

    return userInfo;
  }

  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const newUserInfo = await this.userService.createUser(body);

    return newUserInfo;
  }

  @Put(':id')
  async updateUserById(
    @Param() { id }: { id: string },
    @Body() body: UpdateUserDto,
  ) {
    const updatedUserInfo = await this.userService.updateUser(id, body);

    return updatedUserInfo;
  }

  @Delete(':id')
  async deleteUserById(@Param() { id }: { id: string }) {
    const deletedUserInfo = await this.userService.deleteUser(id);

    return deletedUserInfo;
  }
}
