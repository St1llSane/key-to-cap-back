import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthUserDto } from './dto/createUser.dto';
import { UniqueEmailConflictError } from '@errors/UniqueEmailConflictError';
import { NotFoundError } from '@errors/NotFoundError';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getAllUsers() {
    const users = await this.userRepository.find({
      where: { isActive: true },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'gender',
        'birthDate',
        'createdAt',
        'updatedAt',
      ],
    });

    return users;
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'gender',
        'birthDate',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundError('User with this id was not found');
    }

    return user;
  }

  public async createUser(body: AuthUserDto) {
    const isUserWithThisEmailAlreadyExist = await this.userRepository.exist({
      where: { email: body.email },
    });

    if (isUserWithThisEmailAlreadyExist) {
      throw new UniqueEmailConflictError();
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(body.password, salt);

    const newUser = this.userRepository.create({
      ...body,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    const userDataToReturn = {
      id: newUser.id,
      email: newUser.email,
      password: newUser.password,
    };

    return userDataToReturn;
  }

  public async updateUser(id: string, body: UpdateUserDto) {
    const isUserExist = await this.userRepository.exist({
      where: { id },
    });

    if (!isUserExist) {
      throw new NotFoundError('User with this id was not found');
    }

    return await this.userRepository.update(
      { id },
      {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        birthDate: body.birthDate,
      },
    );
  }

  public async deleteUser(id: string) {
    return await this.userRepository.update(
      { id },
      {
        isActive: false,
      },
    );
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError();
    }

    const userDataToReturn = {
      id: user.id,
      email: user.email,
      password: user.password,
    };

    return userDataToReturn;
  }
}
