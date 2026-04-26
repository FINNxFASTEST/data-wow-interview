import { Injectable, NotFoundException } from '@nestjs/common';

import { ConcertListCacheService } from '../../../concerts/infrastructure/cache/concert-list-cache.service';
import { Reservation } from '../../domain/reservation';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';

@Injectable()
export class CancelReservationUseCase {
    constructor(
        private readonly reservations: ReservationRepository,
        private readonly concertListCache: ConcertListCacheService,
    ) {}

    async execute(reservationId: string, userId: string): Promise<Reservation> {
        const row = await this.reservations.cancelOwn(reservationId, userId);
        if (!row) {
            throw new NotFoundException();
        }
        void this.concertListCache.invalidateConcertAndList(row.concertId);
        return row;
    }
}
