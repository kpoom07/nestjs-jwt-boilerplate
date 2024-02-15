import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
