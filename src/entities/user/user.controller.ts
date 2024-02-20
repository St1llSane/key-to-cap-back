import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
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

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async updateUserById(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
