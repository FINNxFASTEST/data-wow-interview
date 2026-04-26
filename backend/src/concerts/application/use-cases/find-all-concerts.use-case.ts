import { Injectable } from '@nestjs/common';

import { Concert } from '../../domain/concert';
import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';
import { ReservationRepository } from '../../../reservations/infrastructure/persistence/reservation.repository';

export type ConcertListView = {
    concert: Concert;
    reservedCount: number;
    soldOut: boolean;
    remainingSeats: number;
};

@Injectable()
export class FindAllConcertsUseCase {
    constructor(
        private readonly concerts: ConcertRepository,
        private readonly reservations: ReservationRepository,
    ) {}

    async execute(): Promise<ConcertListView[]> {
        const list = await this.concerts.findAll();
        if (!list.length) {
            return [];
        }
        const counts = await this.reservations.countActiveByConcertIds(list.map((c) => c.id));
        return list.map((c) => {
            const reservedCount = counts[c.id] ?? 0;
            const remaining = Math.max(0, c.totalSeats - reservedCount);
            return {
                concert: c,
                reservedCount,
                soldOut: reservedCount >= c.totalSeats,
                remainingSeats: remaining,
            };
        });
    }
}
