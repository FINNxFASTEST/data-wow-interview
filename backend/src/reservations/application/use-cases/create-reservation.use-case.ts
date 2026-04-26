import { Injectable } from '@nestjs/common';

import { Reservation } from '../../domain/reservation';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';

@Injectable()
export class CreateReservationUseCase {
    constructor(private readonly reservations: ReservationRepository) {}

    async execute(userId: string, concertId: string): Promise<Reservation> {
        return this.reservations.reserveForConcert(userId, concertId);
    }
}
