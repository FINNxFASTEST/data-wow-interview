import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Transaction, UniqueConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize';

import { ConcertEntity } from '../../../../../concerts/infrastructure/persistence/relational/entities/concert.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { Reservation } from '../../../../domain/reservation';
import { ReservationRepository, ReservationAuditRow } from '../../reservation.repository';
import { ReservationEntity } from '../entities/reservation.entity';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class ReservationRelationalRepository implements ReservationRepository {
    constructor(
        @InjectConnection() private readonly sequelize: Sequelize,
        @InjectModel(ReservationEntity)
        private readonly reservationModel: typeof ReservationEntity,
        @InjectModel(ConcertEntity)
        private readonly concertModel: typeof ConcertEntity,
    ) {}

    async countActiveByConcertIds(concertIds: string[]): Promise<Record<string, number>> {
        if (!concertIds.length) {
            return {};
        }
        const out: Record<string, number> = {};
        for (const id of concertIds) {
            out[id] = await this.reservationModel.count({
                where: { concertId: id, status: 'active' },
            });
        }
        return out;
    }

    async reserveForConcert(userId: string, concertId: string): Promise<Reservation> {
        try {
            return await this.sequelize.transaction(
                {
                    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
                },
                async (transaction) => {
                    const concert = await this.concertModel.findByPk(concertId, {
                        transaction,
                        lock: transaction.LOCK.UPDATE,
                    });
                    if (!concert) {
                        throw new NotFoundException();
                    }

                    const existing = await this.reservationModel.findOne({
                        where: {
                            userId,
                            concertId,
                            status: 'active' as const,
                        },
                        transaction,
                    });
                    if (existing) {
                        throw new ConflictException({
                            message: 'You already have an active reservation for this concert',
                        });
                    }

                    const activeCount = await this.reservationModel.count({
                        where: { concertId, status: 'active' },
                        transaction,
                    });
                    if (activeCount >= concert.totalSeats) {
                        throw new ConflictException({ message: 'Concert is sold out' });
                    }

                    const row = await this.reservationModel.create(
                        {
                            userId,
                            concertId,
                            status: 'active',
                        } as Parameters<typeof this.reservationModel.create>[0],
                        { transaction },
                    );
                    return ReservationMapper.toDomain(row);
                },
            );
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                throw new ConflictException({
                    message: 'You already have an active reservation for this concert',
                });
            }
            throw err;
        }
    }

    async findByUserId(userId: string): Promise<Reservation[]> {
        const rows = await this.reservationModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        return rows.map((r) => ReservationMapper.toDomain(r));
    }

    async cancelOwn(reservationId: string, userId: string): Promise<Reservation | null> {
        const row = await this.reservationModel.findOne({
            where: { id: reservationId, userId, status: 'active' as const },
        });
        if (!row) {
            return null;
        }
        row.status = 'cancelled' as const;
        await row.save();
        return ReservationMapper.toDomain(row);
    }

    async findForAuditAll(): Promise<ReservationAuditRow[]> {
        const rows = await this.reservationModel.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: UserEntity, required: true },
                { model: ConcertEntity, required: true },
            ],
        });
        return rows.map((r) => {
            const re = r as ReservationEntity & {
                user?: UserEntity;
                concert?: ConcertEntity;
            };
            return {
                reservation: ReservationMapper.toDomain(r),
                userEmail: re.user?.email ?? null,
                concertName: re.concert?.name ?? '',
            };
        });
    }
}
