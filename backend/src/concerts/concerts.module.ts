import { Module } from '@nestjs/common';

import { CreateConcertUseCase } from './application/use-cases/create-concert.use-case';
import { DeleteConcertUseCase } from './application/use-cases/delete-concert.use-case';
import { FindAllConcertsUseCase } from './application/use-cases/find-all-concerts.use-case';
import { FindConcertByIdUseCase } from './application/use-cases/find-concert-by-id.use-case';
import { ConcertsPersistenceModule } from './infrastructure/concerts-persistence.module';
import { ConcertsController } from './presentation/concerts.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
    imports: [ConcertsPersistenceModule, ReservationsModule],
    providers: [
        CreateConcertUseCase,
        DeleteConcertUseCase,
        FindAllConcertsUseCase,
        FindConcertByIdUseCase,
    ],
    controllers: [ConcertsController],
})
export class ConcertsModule {}
