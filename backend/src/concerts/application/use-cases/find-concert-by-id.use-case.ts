import { Injectable, NotFoundException } from '@nestjs/common';

import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';
import { ConcertListView } from './find-all-concerts.use-case';
import { ReservationRepository } from '../../../reservations/infrastructure/persistence/reservation.repository';

@Injectable()
export class FindConcertByIdUseCase {
    constructor(
        private readonly concerts: ConcertRepository,
        private readonly reservations: ReservationRepository,
    ) {}

    async execute(id: string): Promise<ConcertListView> {
        const c = await this.concerts.findById(id);
        if (!c) {
            throw new NotFoundException();
        }
        const counts = await this.reservations.countActiveByConcertIds([c.id]);
        const reservedCount = counts[c.id] ?? 0;
        const remaining = Math.max(0, c.totalSeats - reservedCount);
        return {
            concert: c,
            reservedCount,
            soldOut: reservedCount >= c.totalSeats,
            remainingSeats: remaining,
        };
    }
}
