import { Reservation } from '../../domain/reservation';

export type ReservationAuditRow = {
    reservation: Reservation;
    userEmail: string | null;
    concertName: string;
};

export abstract class ReservationRepository {
    abstract countActiveByConcertIds(concertIds: string[]): Promise<Record<string, number>>;

    abstract reserveForConcert(userId: string, concertId: string): Promise<Reservation>;

    abstract findByUserId(userId: string): Promise<Reservation[]>;

    abstract cancelOwn(reservationId: string, userId: string): Promise<Reservation | null>;

    abstract findForAuditAll(): Promise<ReservationAuditRow[]>;
}
