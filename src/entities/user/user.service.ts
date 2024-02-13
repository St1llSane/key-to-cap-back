import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UniqueEmailConflictError } from '@errors/UniqueEmailConflictError';
import { NotFoundError } from '@errors/NotFoundError';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async getUsers() {
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
      ],
    });

    return { status: 'OK', data: users };
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'gender',
        'birthDate',
        'createdAt',
        'isActive',
      ],
    });

    if (!user || !user.isActive) {
      // return {
      //   status: 'REJECTED',
      //   data: { message: 'User with this id was not found' },
      // };

      throw new NotFoundError('User with this id was not found');
    }

    const acces_token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    const userInfoToReturn = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      acces_token,
    };

    return { status: 'OK', data: userInfoToReturn, acces_token };
  }

  public async createUser(body: CreateUserDto) {
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

    const acces_token = this.jwtService.sign({
      id: newUser.id,
      email: newUser.email,
    });

    const userInfoToReturn = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      gender: newUser.gender,
      birthDate: newUser.birthDate,
      createdAt: newUser.createdAt,
      acces_token,
    };

    return { status: 'CREATED', data: userInfoToReturn };
  }

  public async updateUser(id: string, body: UpdateUserDto) {
    await this.userRepository.update(
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
    await this.userRepository.update(
      { id },
      {
        isActive: false,
      },
    );

    return { status: 'DELETED' };
  }

  // TODO: need to delete in the future
  async findUser(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError();
    }

    return user;
  }
}
