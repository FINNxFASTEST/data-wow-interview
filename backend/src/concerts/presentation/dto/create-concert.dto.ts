import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateConcertDto {
    @ApiProperty({ example: 'Summer night acoustic' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'An intimate show at the old hall.' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ example: 200, minimum: 1 })
    @IsInt()
    @Min(1)
    totalSeats!: number;
}
