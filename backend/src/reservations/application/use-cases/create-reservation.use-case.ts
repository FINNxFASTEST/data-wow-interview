import { Injectable } from '@nestjs/common';

import { ConcertListCacheService } from '../../../concerts/infrastructure/cache/concert-list-cache.service';
import { Reservation } from '../../domain/reservation';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';

@Injectable()
export class CreateReservationUseCase {
    constructor(
        private readonly reservations: ReservationRepository,
        private readonly concertListCache: ConcertListCacheService,
    ) {}

    async execute(userId: string, concertId: string): Promise<Reservation> {
        const r = await this.reservations.reserveForConcert(userId, concertId);
        void this.concertListCache.invalidateConcertAndList(r.concertId);
        return r;
    }
}
