import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';
import databaseConfig from './database/config/database.config';
import redisConfig from './redis/config/redis.config';

import { MongooseConfigService } from './database/mongoose-config.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, authConfig, databaseConfig, redisConfig],
            envFilePath: ['.env'],
        }),
        MongooseModule.forRootAsync({
            useClass: MongooseConfigService,
        }),
        UsersModule,
        AuthModule,
        SessionModule,
    ],
})
export class AppModule {}
