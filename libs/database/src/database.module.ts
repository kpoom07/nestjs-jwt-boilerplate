import { EnvModule } from '@app/env';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { UserRepository } from './repository';
import { User, UserSchema } from './schemas';

export const MongooseForFeatures = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

export const Repository = [UserRepository];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        return {
          uri: `mongodb+srv://${configService.get(
            'MONGO_USERNAME',
          )}:${configService.get('MONGO_PASSWORD')}@${configService.get(
            'MONGO_HOST',
          )}/?retryWrites=true&w=majority`,
          dbName: configService.get('MONGO_DBNAME'),
        };
      },
      imports: [EnvModule],
    }),
    MongooseForFeatures,
  ],
  providers: Repository,
  exports: Repository,
})
export class DatabaseModule {}
