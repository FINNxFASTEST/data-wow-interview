import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { User } from '../../domain/user';
import { CreateUserDto } from '../../presentation/dto/create-user.dto';
import { Role } from '../../../roles/domain/role';
import { Status } from '../../../statuses/domain/status';
import { RoleEnum } from '../../../roles/roles.enum';
import { StatusEnum } from '../../../statuses/statuses.enum';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import bcrypt from 'bcryptjs';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    let password: string | undefined = undefined;
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;
    if (createUserDto.email) {
      const existing = await this.usersRepository.findByEmail(
        createUserDto.email,
      );
      if (existing) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { email: 'emailAlreadyExists' },
        });
      }
      email = createUserDto.email;
    }

    let role: Role | undefined = undefined;
    if (createUserDto.role?.id) {
      const valid = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id));
      if (!valid) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { role: 'roleNotExists' },
        });
      }
      role = { id: createUserDto.role.id };
    }

    let status: Status | undefined = undefined;
    if (createUserDto.status?.id) {
      const valid = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id));
      if (!valid) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { status: 'statusNotExists' },
        });
      }
      status = { id: createUserDto.status.id };
    }

    return this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email,
      password,
      role,
      status,
      provider: createUserDto.provider ?? AuthProvidersEnum.email,
    });
  }
}
