import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserSeedModule } from './user/user-seed.module';
import appConfig from '../../../config/app.config';
import databaseConfig from '../../config/database.config';
import { SequelizeConfigService } from '../../sequelize-config.service';

@Module({
    imports: [
        UserSeedModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, appConfig],
            envFilePath: ['.env'],
        }),
        SequelizeModule.forRootAsync({
            useClass: SequelizeConfigService,
        }),
    ],
})
export class SeedModule {}
