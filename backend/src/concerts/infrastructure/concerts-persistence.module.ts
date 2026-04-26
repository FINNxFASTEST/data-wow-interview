import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ConcertEntity } from './persistence/relational/entities/concert.entity';
import { ConcertRelationalRepository } from './persistence/relational/repositories/concert.relational.repository';
import { ConcertRepository } from './persistence/concert.repository';

@Module({
    imports: [SequelizeModule.forFeature([ConcertEntity])],
    providers: [
        {
            provide: ConcertRepository,
            useClass: ConcertRelationalRepository,
        },
    ],
    exports: [ConcertRepository],
})
export class ConcertsPersistenceModule {}
