import { registerAs } from '@nestjs/config';
import { IsBooleanString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { RedisConfig } from './redis-config.type';

class EnvironmentVariablesValidator {
    @IsBooleanString()
    @IsOptional()
    REDIS_ENABLED: string;

    @IsString()
    @IsOptional()
    REDIS_URL: string;

    @IsString()
    @IsOptional()
    REDIS_HOST: string;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    REDIS_PORT: number;

    @IsString()
    @IsOptional()
    REDIS_PASSWORD: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    REDIS_DB: number;

    @IsString()
    @IsOptional()
    REDIS_SESSION_PREFIX: string;

    @IsInt()
    @Min(60)
    @IsOptional()
    REDIS_SESSION_TTL_SECONDS: number;
}

export default registerAs<RedisConfig>('redis', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        enabled: process.env.REDIS_ENABLED === 'true',
        url: process.env.REDIS_URL,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
        sessionPrefix: process.env.REDIS_SESSION_PREFIX ?? 'auth',
        sessionTtlSeconds: process.env.REDIS_SESSION_TTL_SECONDS
            ? parseInt(process.env.REDIS_SESSION_TTL_SECONDS, 10)
            : 60 * 60 * 24 * 30,
    };
});
