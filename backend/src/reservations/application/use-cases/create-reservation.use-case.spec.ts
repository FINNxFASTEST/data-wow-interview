import { ConflictException, NotFoundException } from '@nestjs/common';

import { CreateReservationUseCase } from './create-reservation.use-case';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';
import { Reservation } from '../../domain/reservation';

function res(id: string, uid: string, cid: string) {
    const r = new Reservation();
    r.id = id;
    r.userId = uid;
    r.concertId = cid;
    r.status = 'active';
    r.createdAt = new Date();
    r.updatedAt = new Date();
    return r;
}

describe('CreateReservationUseCase (delegates to repository transaction)', () => {
    it('should return reservation on success', async () => {
        const r = res('r1', 'u1', 'c1');
        const mock: Pick<ReservationRepository, 'reserveForConcert'> = {
            reserveForConcert: jest.fn().mockResolvedValue(r),
        };
        const uc = new CreateReservationUseCase(mock as unknown as ReservationRepository);
        const out = await uc.execute('u1', 'c1');
        expect(out).toBe(r);
    });

    it('should propagate sold out (ConflictException)', async () => {
        const mock: Pick<ReservationRepository, 'reserveForConcert'> = {
            reserveForConcert: jest
                .fn()
                .mockRejectedValue(new ConflictException({ message: 'Concert is sold out' })),
        };
        const uc = new CreateReservationUseCase(mock as unknown as ReservationRepository);
        await expect(uc.execute('u1', 'c1')).rejects.toBeInstanceOf(ConflictException);
    });

    it('should propagate duplicate user+concert (ConflictException)', async () => {
        const mock: Pick<ReservationRepository, 'reserveForConcert'> = {
            reserveForConcert: jest.fn().mockRejectedValue(
                new ConflictException({
                    message: 'You already have an active reservation for this concert',
                }),
            ),
        };
        const uc = new CreateReservationUseCase(mock as unknown as ReservationRepository);
        await expect(uc.execute('u1', 'c1')).rejects.toBeInstanceOf(ConflictException);
    });

    it('should propagate missing concert (NotFoundException)', async () => {
        const mock: Pick<ReservationRepository, 'reserveForConcert'> = {
            reserveForConcert: jest.fn().mockRejectedValue(new NotFoundException()),
        };
        const uc = new CreateReservationUseCase(mock as unknown as ReservationRepository);
        await expect(uc.execute('u1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
    });
});
