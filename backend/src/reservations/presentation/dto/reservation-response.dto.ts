import { ApiProperty } from '@nestjs/swagger';

import { Reservation } from '../../domain/reservation';
import { ReservationAuditRow } from '../../infrastructure/persistence/reservation.repository';

export class ReservationResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty()
    concertId!: string;

    @ApiProperty({ enum: ['active', 'cancelled'] })
    status!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export function toReservationResponseDto(r: Reservation): ReservationResponseDto {
    return {
        id: r.id,
        userId: r.userId,
        concertId: r.concertId,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
    };
}

export class AuditReservationItemDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty({ nullable: true })
    userEmail!: string | null;

    @ApiProperty()
    concertId!: string;

    @ApiProperty()
    concertName!: string;

    @ApiProperty({ enum: ['active', 'cancelled'] })
    status!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export function toAuditDto(row: ReservationAuditRow): AuditReservationItemDto {
    return {
        id: row.reservation.id,
        userId: row.reservation.userId,
        userEmail: row.userEmail,
        concertId: row.reservation.concertId,
        concertName: row.concertName,
        status: row.reservation.status,
        createdAt: row.reservation.createdAt,
        updatedAt: row.reservation.updatedAt,
    };
}
