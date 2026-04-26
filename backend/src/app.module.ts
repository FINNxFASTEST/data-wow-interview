import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';
import databaseConfig from './database/config/database.config';
import redisConfig from './redis/config/redis.config';

import { SequelizeConfigService } from './database/sequelize-config.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { ConcertsModule } from './concerts/concerts.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, authConfig, databaseConfig, redisConfig],
            envFilePath: ['.env'],
        }),
        SequelizeModule.forRootAsync({
            useClass: SequelizeConfigService,
        }),
        UsersModule,
        AuthModule,
        SessionModule,
        ConcertsModule,
    ],
})
export class AppModule {}
