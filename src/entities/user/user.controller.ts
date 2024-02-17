import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  // Post,
  // Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
// import { CreateUserDto } from './dto/createUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Response } from 'express';
// import { AuthService } from '@auth/auth.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService, // private readonly authService: AuthService,
  ) {}

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

  // @Post()
  // @ApiOperation({ summary: 'Create user' })
  // async createUser(
  //   @Body() body: CreateUserDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   console.log('🚀 ~ UserController ~ body:', body);
  //   const newUserInfo = await this.userService.createUser(body);
  //   const access_token = await this.authService.getJwt(body);

  //   res.cookie('access_token', access_token, {
  //     // TODO: need to secure in the future
  //     secure: false,
  //     httpOnly: true,
  //     expires: new Date(Date.now() + 3600000),
  //   });

  //   return newUserInfo;
  // }

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
