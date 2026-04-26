import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

import { AllConfigType } from '../config/config.type';
import { ConcertEntity } from '../concerts/infrastructure/persistence/relational/entities/concert.entity';
import { ReservationEntity } from '../reservations/infrastructure/persistence/relational/entities/reservation.entity';
import { SessionEntity } from '../session/infrastructure/persistence/relational/entities/session.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    constructor(private readonly configService: ConfigService<AllConfigType>) {}

    createSequelizeOptions(): SequelizeModuleOptions {
        const uri = this.configService.get('database.url', { infer: true });
        const nodeEnv = this.configService.get('app.nodeEnv', { infer: true });
        const dbSyncOff = process.env.DATABASE_SYNC === 'false';
        const synchronize = nodeEnv !== 'production' && !dbSyncOff;

        const base: SequelizeModuleOptions = {
            dialect: 'postgres',
            models: [UserEntity, SessionEntity, ConcertEntity, ReservationEntity],
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
