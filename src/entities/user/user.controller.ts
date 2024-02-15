import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Gel all users' })
  async getAllUsers() {
    const usersInfo = await this.userService.getAllUsers();

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

  @Patch(':id')
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

  // @Get(':email')
  // async authUser(@Param() { id }: { id: string }) {
  //   const authUserInfo = await this.userService.deleteUser(id);

  //   return authUserInfo;
  // }
}
