import { NotFoundException } from '@nestjs/common';

import { CancelReservationUseCase } from './cancel-reservation.use-case';
import { ReservationRepository } from '../../infrastructure/persistence/reservation.repository';
import { Reservation } from '../../domain/reservation';

function row(id: string) {
    const r = new Reservation();
    r.id = id;
    r.userId = 'u1';
    r.concertId = 'c1';
    r.status = 'cancelled';
    r.createdAt = new Date();
    r.updatedAt = new Date();
    return r;
}

describe('CancelReservationUseCase', () => {
    it('should cancel own active reservation', async () => {
        const cancelled = row('r1');
        const mock: Pick<ReservationRepository, 'cancelOwn'> = {
            cancelOwn: jest.fn().mockResolvedValue(cancelled),
        };
        const uc = new CancelReservationUseCase(mock as unknown as ReservationRepository);
        const out = await uc.execute('r1', 'u1');
        expect(out).toBe(cancelled);
        expect(mock.cancelOwn).toHaveBeenCalledWith('r1', 'u1');
    });

    it('should return not found when not own or missing', async () => {
        const mock: Pick<ReservationRepository, 'cancelOwn'> = {
            cancelOwn: jest.fn().mockResolvedValue(null),
        };
        const uc = new CancelReservationUseCase(mock as unknown as ReservationRepository);
        await expect(uc.execute('r1', 'other-user')).rejects.toBeInstanceOf(NotFoundException);
    });
});
