import { Public } from '@app/utils';
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Body,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import RequestWithUser, { RegisterDto } from './auth.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const { user } = req;
    const { _id: userId } = user;

    const { cookie: accessTokenCookie } =
      this.authService.getCookieWithJwtAccessToken(userId);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(userId);

    this.authService.setCurrentRefreshToken(refreshToken, userId);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return { ...user };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const { user } = request;
    const { _id: userId } = user;

    const { cookie: accessTokenCookie } =
      this.authService.getCookieWithJwtAccessToken(userId);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return { ...request.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
