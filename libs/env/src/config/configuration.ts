import { Environment, EnvironmentVariables } from './validation';

export default (): EnvironmentVariables => ({
  NODE_ENV: Environment[process.env.NODE_ENV],
  PORT: parseInt(process.env.PORT, 10),
  MONGO_URI: process.env.MONGO_HOST,
  MONGO_DBNAME: process.env.MONGO_DBNAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
});
