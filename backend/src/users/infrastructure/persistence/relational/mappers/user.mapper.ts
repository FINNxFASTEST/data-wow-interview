import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../../../../../roles/domain/role';
import { Status } from '../../../../../statuses/domain/status';

export class UserMapper {
    static toDomain(raw: UserEntity): User {
        const domainEntity = new User();
        domainEntity.id = raw.id;
        domainEntity.email = raw.email;
        domainEntity.password = raw.password;
        domainEntity.provider = raw.provider;
        domainEntity.firstName = raw.firstName;
        domainEntity.lastName = raw.lastName;

        if (raw.roleId != null) {
            domainEntity.role = new Role();
            domainEntity.role.id = raw.roleId;
        }

        if (raw.statusId != null) {
            domainEntity.status = new Status();
            domainEntity.status.id = raw.statusId;
        }

        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt!;

        return domainEntity;
    }

    static toPersistence(domainEntity: User): Partial<UserEntity> {
        const row: Partial<UserEntity> = {
            email: domainEntity.email,
            password: domainEntity.password,
            provider: domainEntity.provider,
            firstName: domainEntity.firstName,
            lastName: domainEntity.lastName,
        };

        if (domainEntity.id) {
            row.id = domainEntity.id;
        }

        if (domainEntity.role) {
            row.roleId =
                typeof domainEntity.role.id === 'string'
                    ? parseInt(domainEntity.role.id, 10)
                    : (domainEntity.role.id as number);
        }

        if (domainEntity.status) {
            row.statusId =
                typeof domainEntity.status.id === 'string'
                    ? parseInt(domainEntity.status.id, 10)
                    : (domainEntity.status.id as number);
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
