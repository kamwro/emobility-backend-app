import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  @IsNotEmpty()
  NEST_API_PORT: number = 3000;

  @IsNumber()
  @IsNotEmpty()
  POSTGRES_PORT: number = 5432;

  @IsNumber()
  @IsNotEmpty()
  POSTGRES_DBEAVER_PORT: number = 5433;

  @IsString()
  @IsNotEmpty()
  POSTGRES_HOST: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_NAME: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  @IsNumber()
  @IsNotEmpty()
  TOKEN_EXPIRES_IN_MIN: number = 5;

  @IsNumber()
  @IsNotEmpty()
  THROTTLE_TTL_SHORT: number = 1000;

  @IsNumber()
  @IsNotEmpty()
  THROTTLE_LIMIT_SHORT: number = 3;

  @IsNumber()
  @IsNotEmpty()
  THROTTLE_TTL_MEDIUM: number = 10000;

  @IsNumber()
  @IsNotEmpty()
  THROTTLE_LIMIT_MEDIUM: number = 20;

  @IsNumber()
  @IsNotEmpty()
  THROTTLE_TTL_LONG: number = 60000;

  @IsNumber()
  @IsNotEmpty()
  THROTTLE_LIMIT_LONG: number = 100;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
