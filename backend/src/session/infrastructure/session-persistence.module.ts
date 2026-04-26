import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionEntity } from './persistence/relational/entities/session.entity';
import { SessionRepository } from './persistence/session.repository';
import { SessionRelationalRepository } from './persistence/relational/repositories/session.relational.repository';
import { SessionCacheService } from './cache/session-cache.service';

@Module({
    imports: [SequelizeModule.forFeature([SessionEntity])],
    providers: [
        SessionCacheService,
        {
            provide: SessionRepository,
            useClass: SessionRelationalRepository,
        },
    ],
    exports: [SessionRepository],
})
export class SessionPersistenceModule {}
