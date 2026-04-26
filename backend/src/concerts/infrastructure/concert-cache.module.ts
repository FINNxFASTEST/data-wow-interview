import { Module } from '@nestjs/common';

import { ConcertListCacheService } from './cache/concert-list-cache.service';

@Module({
    providers: [ConcertListCacheService],
    exports: [ConcertListCacheService],
})
export class ConcertCacheModule {}
