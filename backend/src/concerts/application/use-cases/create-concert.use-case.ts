import { Injectable } from '@nestjs/common';

import { CreateConcertDto } from '../../presentation/dto/create-concert.dto';
import { Concert } from '../../domain/concert';
import { ConcertListCacheService } from '../../infrastructure/cache/concert-list-cache.service';
import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';

@Injectable()
export class CreateConcertUseCase {
    constructor(
        private readonly concerts: ConcertRepository,
        private readonly concertListCache: ConcertListCacheService,
    ) {}

    async execute(createdBy: string, dto: CreateConcertDto): Promise<Concert> {
        const created = await this.concerts.create({
            name: dto.name,
            description: dto.description,
            totalSeats: dto.totalSeats,
            createdBy,
        });
        void this.concertListCache.invalidateList();
        return created;
    }
}
