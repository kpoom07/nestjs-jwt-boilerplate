import * as crypto from 'crypto';

export const hashOption = {
  parallelism: 1,
  memoryCost: 64000,
  timeCost: 3,
};

export const salt = crypto.randomBytes(16);
