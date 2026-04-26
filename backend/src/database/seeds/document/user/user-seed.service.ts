import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserSchemaClass } from '../../../../users/infrastructure/persistence/document/entities/user.schema';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserSchemaClass>,
  ) {}

  async run(): Promise<{
    admin: UserSchemaClass;
    host: UserSchemaClass;
    customer: UserSchemaClass;
  }> {
    const admin = await this.upsert({
      email: 'admin@example.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: RoleEnum.admin,
    });

    const host = await this.upsert({
      email: 'host@example.com',
      firstName: 'Helen',
      lastName: 'Host',
      role: RoleEnum.host,
    });

    const customer = await this.upsert({
      email: 'customer@example.com',
      firstName: 'Charlie',
      lastName: 'Customer',
      role: RoleEnum.customer,
    });

    return { admin, host, customer };
  }

  findByEmail(email: string) {
    return this.model.findOne({ email });
  }

  private async upsert(input: {
    email: string;
    firstName: string;
    lastName: string;
    role: RoleEnum;
    password?: string;
  }): Promise<UserSchemaClass> {
    const existing = await this.model.findOne({ email: input.email });
    if (existing) return existing;

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(input.password ?? 'secret', salt);

    const data = new this.model({
      email: input.email,
      password,
      firstName: input.firstName,
      lastName: input.lastName,
      role: { _id: input.role.toString() },
      status: { _id: StatusEnum.active.toString() },
    });

    return data.save();
  }
}
