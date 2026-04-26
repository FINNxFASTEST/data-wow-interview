import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Table({ tableName: 'sessions', paranoid: true })
export class SessionEntity extends Model {
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    hash!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @DeletedAt
    deletedAt?: Date;

    @BelongsTo(() => UserEntity)
    user?: UserEntity;
}
