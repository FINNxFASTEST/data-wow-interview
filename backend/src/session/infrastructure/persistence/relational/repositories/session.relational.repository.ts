import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

import { User } from '../../../../../users/domain/user';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { SessionEntity } from '../entities/session.entity';
import { SessionMapper } from '../mappers/session.mapper';
import { SessionCacheService } from '../../../cache/session-cache.service';

@Injectable()
export class SessionRelationalRepository implements SessionRepository {
    constructor(
        @InjectModel(SessionEntity)
        private readonly sessionModel: typeof SessionEntity,
        private readonly sessionCache: SessionCacheService,
    ) {}

    async findById(id: Session['id']): Promise<NullableType<Session>> {
        const sid = id.toString();
        const cachedSession = await this.sessionCache.get(sid);
        if (cachedSession) {
            return cachedSession;
        }

        const row = await this.sessionModel.findByPk(sid);
        if (!row) {
            return null;
        }
        const session = SessionMapper.toDomain(row);
        await this.sessionCache.set(session);
        return session;
    }

    async create(
        data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    ): Promise<Session> {
        const created = await this.sessionModel.create(
            SessionMapper.toPersistence(data as Session) as Parameters<
                typeof this.sessionModel.create
            >[0],
        );
        const session = SessionMapper.toDomain(created);
        await this.sessionCache.set(session);
        return session;
    }

    async update(id: Session['id'], payload: Partial<Session>): Promise<Session | null> {
        const row = await this.sessionModel.findByPk(id.toString());
        if (!row) {
            return null;
        }
        const current = SessionMapper.toDomain(row);
        const merged = { ...current, ...payload, id: current.id } as Session;
        await row.update(
            SessionMapper.toPersistence(merged) as Parameters<SessionEntity['update']>[0],
        );
        await row.reload();
        const updatedSession = SessionMapper.toDomain(row);
        await this.sessionCache.set(updatedSession);
        return updatedSession;
    }

    async updateByHash(
        conditions: { id: Session['id']; hash: Session['hash'] },
        payload: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
    ): Promise<Session | null> {
        const [affectedCount] = await this.sessionModel.update(
            { hash: payload.hash } as { hash: string },
            {
                where: { id: conditions.id.toString(), hash: conditions.hash },
            },
        );
        if (!affectedCount) {
            return null;
        }
        const row = await this.sessionModel.findByPk(conditions.id.toString());
        if (!row) {
            return null;
        }
        const updatedSession = SessionMapper.toDomain(row);
        await this.sessionCache.set(updatedSession);
        return updatedSession;
    }

    async deleteById(id: Session['id']): Promise<void> {
        const existing = await this.findById(id);
        await this.sessionModel.destroy({ where: { id: id.toString() } });
        await this.sessionCache.deleteById(id, existing?.user?.id);
    }

    async deleteByUserId({ userId }: { userId: User['id'] }): Promise<void> {
        await this.sessionModel.destroy({ where: { userId: userId.toString() } });
        await this.sessionCache.deleteByUserId(userId);
    }

    async deleteByUserIdWithExclude({
        userId,
        excludeSessionId,
    }: {
        userId: User['id'];
        excludeSessionId: Session['id'];
    }): Promise<void> {
        await this.sessionModel.destroy({
            where: {
                userId: userId.toString(),
                id: { [Op.ne]: excludeSessionId.toString() },
            },
        });
        await this.sessionCache.deleteByUserIdWithExclude(userId, excludeSessionId);
    }
}
