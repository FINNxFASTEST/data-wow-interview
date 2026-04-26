import { Injectable, NotFoundException } from '@nestjs/common';

import { Reservation } from '../../domain/reservation';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';

@Injectable()
export class CancelReservationUseCase {
    constructor(private readonly reservations: ReservationRepository) {}

    async execute(reservationId: string, userId: string): Promise<Reservation> {
        const row = await this.reservations.cancelOwn(reservationId, userId);
        if (!row) {
            throw new NotFoundException();
        }
        return row;
    }
}
