import { Injectable, NotFoundException } from '@nestjs/common';

import { ConcertListCacheService } from '../../infrastructure/cache/concert-list-cache.service';
import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';

@Injectable()
export class DeleteConcertUseCase {
    constructor(
        private readonly concerts: ConcertRepository,
        private readonly concertListCache: ConcertListCacheService,
    ) {}

    async execute(id: string): Promise<void> {
        const c = await this.concerts.findById(id);
        if (!c) {
            throw new NotFoundException();
        }
        await this.concerts.remove(id);
        void this.concertListCache.invalidateConcertAndList(id);
    }
}
