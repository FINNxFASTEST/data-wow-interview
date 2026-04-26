export type ReservationStatus = 'active' | 'cancelled';

export class Reservation {
    id!: string;
    userId!: string;
    concertId!: string;
    status!: ReservationStatus;
    createdAt!: Date;
    updatedAt!: Date;
}
