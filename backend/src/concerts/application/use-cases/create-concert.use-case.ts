import { Injectable } from '@nestjs/common';

import { CreateConcertDto } from '../../presentation/dto/create-concert.dto';
import { Concert } from '../../domain/concert';
import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';

@Injectable()
export class CreateConcertUseCase {
    constructor(private readonly concerts: ConcertRepository) {}

    async execute(createdBy: string, dto: CreateConcertDto): Promise<Concert> {
        return this.concerts.create({
            name: dto.name,
            description: dto.description,
            totalSeats: dto.totalSeats,
            createdBy,
        });
    }
}
