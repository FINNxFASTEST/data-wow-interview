import { Reservation, ReservationStatus } from '../../../../domain/reservation';
import { ReservationEntity } from '../entities/reservation.entity';

export class ReservationMapper {
    static toDomain(raw: ReservationEntity): Reservation {
        const r = new Reservation();
        r.id = raw.id;
        r.userId = raw.userId;
        r.concertId = raw.concertId;
        r.status = raw.status as ReservationStatus;
        r.createdAt = raw.createdAt;
        r.updatedAt = raw.updatedAt;
        return r;
    }
}
