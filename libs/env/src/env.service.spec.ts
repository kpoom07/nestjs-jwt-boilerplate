import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validate, EnvironmentVariables } from './config/validation';

describe('ConfigService', () => {
  let service: ConfigService<EnvironmentVariables>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validate,
        }),
      ],
    }).compile();

    service = module.get<ConfigService<EnvironmentVariables>>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be env defined', () => {
    expect(service.get('PORT')).toBeDefined();
    expect(service.get('MONGO_URI')).toBeDefined();
    expect(service.get('REDIS_HOST')).toBeDefined();
    expect(service.get('REDIS_PORT')).toBeDefined();
    expect(service.get('REDIS_USERNAME')).toBeDefined();
    expect(service.get('REDIS_PASSWORD')).toBeDefined();
  });
});
