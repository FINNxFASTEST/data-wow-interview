import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ConcertEntity } from '../../concerts/infrastructure/persistence/relational/entities/concert.entity';
import { ReservationEntity } from './persistence/relational/entities/reservation.entity';
import { ReservationRelationalRepository } from './persistence/relational/repositories/reservation.relational.repository';
import { ReservationRepository } from './persistence/reservation.repository';

@Module({
    imports: [SequelizeModule.forFeature([ReservationEntity, ConcertEntity])],
    providers: [
        {
            provide: ReservationRepository,
            useClass: ReservationRelationalRepository,
        },
    ],
    exports: [ReservationRepository],
})
export class ReservationsPersistenceModule {}
