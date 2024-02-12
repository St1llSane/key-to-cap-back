import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {}

  public async getUsers() {
    const users = await this.UserRepository.find({ select: ['id', 'email'] });

    return users;
  }

  public async getUserById(id: string) {
    const user = await this.UserRepository.findOne({
      where: { id },
      select: ['id', 'email', 'isActive'],
    });

    return user;
  }

  public async createUser(body: CreateUserDto) {
    // const isUserWithThisEmailAlreadyExist = await this.UserRepository.exist({
    //   where: { email: body.email },
    // });

    // // TODO need to think how to make it's clear if user is not exist
    // if (isUserWithThisEmailAlreadyExist) {
    //   return {
    //     message: 'User with this email is already exist',
    //   };
    // }

    const salt = await genSalt(10);
    const hashedPassword = await hash(body.password, salt);

    const newUser = this.UserRepository.create({
      ...body,
      password: hashedPassword,
    });
    await this.UserRepository.save(newUser);

    const userInfoToReturn = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      gender: newUser.gender,
      birthDate: newUser.birthDate,
      createdAt: newUser.createdAt,
    };

    return userInfoToReturn;
  }

  public async updateUser(id: string, body: UpdateUserDto) {
    // const user: { password: string } = await this.UserRepository.findOne({
    //   where: { id },
    //   select: ['password'],
    // });

    // const isPasswordsMatch = await compare(
    //   updatedUserData.password,
    //   user.password,
    // );
    // console.log(updatedUserData);
    // console.log(user);
    // console.log(isPasswordsMatch);

    // if (updatedUserData.password && !isPasswordsMatch) {
    //   const salt = await genSalt(10);
    //   const newHashedPassword = await hash(userData.password, salt);

    // }

    return await this.UserRepository.update(
      { id },
      {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        birthDate: body.birthDate,
      },
    );
  }

  public async deleteUser(id: string) {
    return await this.UserRepository.update(
      { id },
      {
        isActive: false,
      },
    );
  }
}
