import { User } from '../../../../../users/domain/user';
import { Session } from '../../../../domain/session';
import { SessionEntity } from '../entities/session.entity';

export class SessionMapper {
    static toDomain(raw: SessionEntity): Session {
        const domainEntity = new Session();
        domainEntity.id = raw.id;

        const user = new User();
        user.id = raw.userId;
        domainEntity.user = user;

        domainEntity.hash = raw.hash;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt!;
        return domainEntity;
    }

    static toPersistence(domainEntity: Session): Partial<SessionEntity> {
        const row: Partial<SessionEntity> = {
            userId: domainEntity.user.id.toString(),
            hash: domainEntity.hash,
        };

        if (domainEntity.id) {
            row.id = domainEntity.id as string;
        }
        if (domainEntity.createdAt) {
            row.createdAt = domainEntity.createdAt;
        }
        if (domainEntity.updatedAt) {
            row.updatedAt = domainEntity.updatedAt;
        }
        if (domainEntity.deletedAt) {
            row.deletedAt = domainEntity.deletedAt;
        }
        return row;
    }
}
