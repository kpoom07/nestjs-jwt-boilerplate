import { Request } from 'express';
import { CreateUserDto } from '@app/interfaces';
import { User } from '@app/database';

export interface TokenPayload {
  userId: string;
}

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;

export interface LoginDto {
  username: string;
  password: string;
}

export type RegisterDto = CreateUserDto;
