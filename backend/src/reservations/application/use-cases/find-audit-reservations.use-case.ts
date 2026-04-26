import { Injectable } from '@nestjs/common';

import {
    ReservationRepository,
    ReservationAuditRow,
} from '../../infrastructure/persistence/reservation.repository';

@Injectable()
export class FindAuditReservationsUseCase {
    constructor(private readonly reservations: ReservationRepository) {}

    async execute(): Promise<ReservationAuditRow[]> {
        return this.reservations.findForAuditAll();
    }
}
