import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

import { AllConfigType } from '../config/config.type';
import { SessionEntity } from '../session/infrastructure/persistence/relational/entities/session.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    constructor(private readonly configService: ConfigService<AllConfigType>) {}

    createSequelizeOptions(): SequelizeModuleOptions {
        const uri = this.configService.get('database.url', { infer: true });
        const synchronize = this.configService.get('app.nodeEnv', { infer: true }) !== 'production';

        const base: SequelizeModuleOptions = {
            dialect: 'postgres',
            models: [UserEntity, SessionEntity],
            autoLoadModels: true,
            synchronize,
            logging: false,
        };

        if (uri) {
            return {
                ...base,
                uri,
            };
        }

        return {
            ...base,
            host: this.configService.get('database.host', { infer: true }),
            port: this.configService.get('database.port', { infer: true }),
            username: this.configService.get('database.username', { infer: true }),
            password: this.configService.get('database.password', { infer: true }),
            database: this.configService.get('database.name', { infer: true }),
        };
    }
}
