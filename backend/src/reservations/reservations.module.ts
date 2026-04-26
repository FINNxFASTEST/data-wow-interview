import { Module } from '@nestjs/common';

import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { CancelReservationUseCase } from './application/use-cases/cancel-reservation.use-case';
import { FindMyReservationsUseCase } from './application/use-cases/find-my-reservations.use-case';
import { FindAuditReservationsUseCase } from './application/use-cases/find-audit-reservations.use-case';
import { ReservationsPersistenceModule } from './infrastructure/reservations-persistence.module';
import { ReservationsController } from './presentation/reservations.controller';

@Module({
    imports: [ReservationsPersistenceModule],
    providers: [
        CreateReservationUseCase,
        CancelReservationUseCase,
        FindMyReservationsUseCase,
        FindAuditReservationsUseCase,
    ],
    controllers: [ReservationsController],
    exports: [
        ReservationsPersistenceModule,
        CreateReservationUseCase,
        CancelReservationUseCase,
        FindMyReservationsUseCase,
        FindAuditReservationsUseCase,
    ],
})
export class ReservationsModule {}
