import { Injectable } from '@nestjs/common';

import { Concert } from '../../domain/concert';
import { ConcertListCacheService } from '../../infrastructure/cache/concert-list-cache.service';
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
        private readonly concertListCache: ConcertListCacheService,
    ) {}

    async execute(): Promise<ConcertListView[]> {
        const fromCache = await this.concertListCache.getList();
        if (fromCache) {
            return fromCache;
        }
        const list = await this.concerts.findAll();
        if (!list.length) {
            void this.concertListCache.setList([]);
            return [];
        }
        const counts = await this.reservations.countActiveByConcertIds(list.map((c) => c.id));
        const views = list.map((c) => {
            const reservedCount = counts[c.id] ?? 0;
            const remaining = Math.max(0, c.totalSeats - reservedCount);
            return {
                concert: c,
                reservedCount,
                soldOut: reservedCount >= c.totalSeats,
                remainingSeats: remaining,
            };
        });
        void this.concertListCache.setList(views);
        return views;
    }
}
