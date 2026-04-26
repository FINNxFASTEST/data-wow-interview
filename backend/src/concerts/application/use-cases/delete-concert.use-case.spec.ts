import { NotFoundException } from '@nestjs/common';

import { DeleteConcertUseCase } from './delete-concert.use-case';
import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';
import { Concert } from '../../domain/concert';

describe('DeleteConcertUseCase', () => {
    const existing = (() => {
        const c = new Concert();
        c.id = 'c1';
        c.name = 'A';
        c.description = 'D';
        c.totalSeats = 1;
        c.createdBy = 'u1';
        c.createdAt = new Date();
        c.updatedAt = new Date();
        return c;
    })();

    it('should delete an existing concert', async () => {
        const mock: Pick<ConcertRepository, 'findById' | 'remove'> = {
            findById: jest.fn().mockResolvedValue(existing),
            remove: jest.fn().mockResolvedValue(undefined),
        };
        const cache = { invalidateConcertAndList: jest.fn() };
        const uc = new DeleteConcertUseCase(mock as unknown as ConcertRepository, cache as never);
        await uc.execute('c1');
        expect(mock.remove).toHaveBeenCalledWith('c1');
        expect(cache.invalidateConcertAndList).toHaveBeenCalledWith('c1');
    });

    it('should throw when not found', async () => {
        const mock: Pick<ConcertRepository, 'findById' | 'remove'> = {
            findById: jest.fn().mockResolvedValue(null),
            remove: jest.fn(),
        };
        const cache = { invalidateConcertAndList: jest.fn() };
        const uc = new DeleteConcertUseCase(mock as unknown as ConcertRepository, cache as never);
        await expect(uc.execute('missing')).rejects.toBeInstanceOf(NotFoundException);
        expect(mock.remove).not.toHaveBeenCalled();
        expect(cache.invalidateConcertAndList).not.toHaveBeenCalled();
    });
});
