import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Table({ tableName: 'concerts' })
export class ConcertEntity extends Model {
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    description!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    totalSeats!: number;

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.UUID, allowNull: false })
    createdBy!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @BelongsTo(() => UserEntity, { foreignKey: 'createdBy' })
    creator?: UserEntity;
}
