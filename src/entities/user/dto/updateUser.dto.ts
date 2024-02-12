import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserGender } from '../types';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsISO8601()
  @IsOptional()
  birthDate: Date;

  @IsEnum(UserGender)
  @IsOptional()
  gender: UserGender;
}
