import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';

export class User {
  id!: string;

  @Expose({ groups: ['me', 'admin'] })
  email!: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider!: string;

  firstName!: string | null;
  lastName!: string | null;
  role?: Role | null;
  status?: Status;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
}
