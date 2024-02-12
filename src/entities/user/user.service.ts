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
    const users = await this.UserRepository.find({
      where: { isActive: true },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'gender',
        'birthDate',
        'createdAt',
      ],
    });

    return { status: 'OK', data: users };
  }

  public async getUserById(id: string) {
    const user = await this.UserRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'gender',
        'birthDate',
        'createdAt',
      ],
    });

    if (!user.isActive) {
      return {
        status: 'REJECTED',
        data: { message: 'User with this id does not exist' },
      };
    }

    return { status: 'OK', data: user };
  }

  public async createUser(body: CreateUserDto) {
    const isUserWithThisEmailAlreadyExist = await this.UserRepository.exist({
      where: { email: body.email },
    });

    if (isUserWithThisEmailAlreadyExist) {
      return {
        status: 'REJECTED',
        message: 'User with this email is already exist',
      };
    }

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

    return { status: 'CREATED', data: userInfoToReturn };
  }

  public async updateUser(id: string, body: UpdateUserDto) {
    await this.UserRepository.update(
      { id },
      {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        birthDate: body.birthDate,
      },
    );

    return { status: 'UPDATED' };
  }

  public async deleteUser(id: string) {
    await this.UserRepository.update(
      { id },
      {
        isActive: false,
      },
    );

    return { status: 'DELETED' };
  }
}
