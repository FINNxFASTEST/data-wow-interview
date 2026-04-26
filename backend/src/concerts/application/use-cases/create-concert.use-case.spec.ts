import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateConcertUseCase } from './create-concert.use-case';
import { CreateConcertDto } from '../../presentation/dto/create-concert.dto';
import { ConcertRepository } from '../../infrastructure/persistence/concert.repository';
import { Concert } from '../../domain/concert';

describe('CreateConcertUseCase', () => {
    const concert = new Concert();
    concert.id = 'c1';
    concert.name = 'A';
    concert.description = 'D';
    concert.totalSeats = 10;
    concert.createdBy = 'u1';
    concert.createdAt = new Date();
    concert.updatedAt = new Date();

    it('should create a concert on valid input', async () => {
        const mock: Pick<ConcertRepository, 'create'> = {
            create: jest.fn().mockResolvedValue(concert),
        };
        const cache = { invalidateList: jest.fn() };
        const uc = new CreateConcertUseCase(mock as unknown as ConcertRepository, cache as never);
        const dto: CreateConcertDto = {
            name: 'A',
            description: 'D',
            totalSeats: 10,
        };
        const out = await uc.execute('u1', dto);
        expect(out).toBe(concert);
        expect(cache.invalidateList).toHaveBeenCalled();
        expect(mock.create).toHaveBeenCalledWith({
            name: 'A',
            description: 'D',
            totalSeats: 10,
            createdBy: 'u1',
        });
    });
});

describe('CreateConcertDto validation', () => {
    it('should fail for invalid body', async () => {
        const dto = plainToInstance(CreateConcertDto, {
            name: '',
            description: 'ok',
            totalSeats: 0,
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});
