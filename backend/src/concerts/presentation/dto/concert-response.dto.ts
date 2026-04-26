import { ApiProperty } from '@nestjs/swagger';

import { Concert } from '../../domain/concert';

export class ConcertListItemResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    description!: string;

    @ApiProperty()
    totalSeats!: number;

    @ApiProperty()
    createdBy!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty()
    reservedCount!: number;

    @ApiProperty()
    remainingSeats!: number;

    @ApiProperty()
    soldOut!: boolean;
}

export function toConcertListItemDto(view: {
    concert: Concert;
    reservedCount: number;
    soldOut: boolean;
    remainingSeats: number;
}): ConcertListItemResponseDto {
    const c = view.concert;
    return {
        id: c.id,
        name: c.name,
        description: c.description,
        totalSeats: c.totalSeats,
        createdBy: c.createdBy,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        reservedCount: view.reservedCount,
        soldOut: view.soldOut,
        remainingSeats: view.remainingSeats,
    };
}
