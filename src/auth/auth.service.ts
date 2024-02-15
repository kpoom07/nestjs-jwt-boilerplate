import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, TokenPayload } from './auth.interface';
import { UserRepository, User } from '@app/database';
import { omit } from 'lodash';
import { hashOption, salt } from '@app/utils';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async register(data: RegisterDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await argon2.hash(data.password, {
      ...hashOption,
      salt,
    });
    try {
      const user = await this.userRepository.create({
        ...data,
        password: hashedPassword,
      });

      return omit(user, ['password']);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ _id: id });
    if (user) {
      return omit(user.toJSON(), ['password']);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ username });
      const isValidPassword = await this.verifyPassword(
        user.password,
        password,
      );
      if (user && isValidPassword) {
        return omit(user.toJSON(), ['password']);
      }
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getCookieWithJwtAccessToken(userId: string) {
    const JWT_ACCESS_TOKEN_EXPIRATION_TIME = 15 * 60;
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: 'accessKey',
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });

    const cookie = `Authentication=${token}; Path=/; Max-Age=${JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;

    return {
      cookie,
      token,
    };
  }

  getCookieWithJwtRefreshToken(userId: string) {
    const JWT_REFRESH_TOKEN_EXPIRATION_TIME = 24 * 60 * 60;
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: 'refreshKey',
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    const cookie = `Refresh=${token}; Path=/; Max-Age=${JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return {
      cookie,
      token,
    };
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; Path=/; Max-Age=0',
      'Refresh=; Path=/; Max-Age=0',
    ];
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hashedToken = await argon2.hash(refreshToken, {
      ...hashOption,
      salt,
    });
    await this.cacheManager.set(`refresh_token:${userId}`, hashedToken);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const token = await this.cacheManager
      .get(`refresh_token:${userId}`)
      .then((value) => {
        return value.toString();
      });

    const isRefreshTokenMatching = await argon2.verify(token, refreshToken, {
      ...hashOption,
    });

    if (isRefreshTokenMatching) {
      return this.getUserById(userId);
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(plainTextPassword, password, {
      ...hashOption,
    });
  }
}
