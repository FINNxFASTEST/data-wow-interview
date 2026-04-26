import { Injectable, NotFoundException } from '@nestjs/common';

import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';

@Injectable()
export class DeleteConcertUseCase {
    constructor(private readonly concerts: ConcertRepository) {}

    async execute(id: string): Promise<void> {
        const c = await this.concerts.findById(id);
        if (!c) {
            throw new NotFoundException();
        }
        await this.concerts.remove(id);
    }
}
