import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserGender } from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsISO8601()
  @IsOptional()
  @ApiProperty()
  birthDate: Date;

  @IsEnum(UserGender)
  @IsOptional()
  @ApiProperty()
  gender: UserGender;
}
