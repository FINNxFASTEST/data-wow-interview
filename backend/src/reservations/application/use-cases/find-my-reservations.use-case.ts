import { Injectable } from '@nestjs/common';

import { Reservation } from '../../domain/reservation';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';

@Injectable()
export class FindMyReservationsUseCase {
    constructor(private readonly reservations: ReservationRepository) {}

    async execute(userId: string): Promise<Reservation[]> {
        return this.reservations.findByUserId(userId);
    }
}
