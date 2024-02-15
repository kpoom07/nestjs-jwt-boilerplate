import { DatabaseModule } from '@app/database';
import { EnvModule } from '@app/env';
import { HealthModule } from '@app/health';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import Redis from 'ioredis';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    CacheModule.registerAsync({
      imports: [EnvModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          redisInstance: new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
            keyPrefix: 'cache:',
          }),
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
