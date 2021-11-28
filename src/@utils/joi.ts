import * as joi from '@hapi/joi';

export const configValidationSchema = joi.object({
  HOST: joi.string().required(),
  PORT: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.string().required(),
  DB_DATABASE: joi.string().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().allow(''),
  MAIL_HOST: joi.string().required(),
  MAIL_PORT: joi.string().required(),
  MAIL_USERNAME: joi.string().required(),
  MAIL_PASSWORD: joi.string().required(),
  MAIL_FROM: joi.string().required(),
});
