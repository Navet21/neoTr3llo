import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('dev'),
  DB_NAME: Joi.string().required().description('El nombre de la base de datos PostgreSQL'),
  DB_PASSWORD: Joi.string().required().description('La contraseña de la base de datos PostgreSQL'),
  DB_USERNAME: Joi.string().required().description('El nombre de usuario de la base de datos PostgreSQL'),
  DB_PORT: Joi.number().default(5432),
  PORT: Joi.number().default(3000)
});