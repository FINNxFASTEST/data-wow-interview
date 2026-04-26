import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { User } from '../../domain/user';
import { UpdateUserDto } from '../../presentation/dto/update-user.dto';
import { Role } from '../../../roles/domain/role';
import { Status } from '../../../statuses/domain/status';
import { RoleEnum } from '../../../roles/roles.enum';
import { StatusEnum } from '../../../statuses/statuses.enum';
import bcrypt from 'bcryptjs';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    let password: string | undefined = undefined;
    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);
      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;
    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { email: 'emailAlreadyExists' },
        });
      }
      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let role: Role | undefined = undefined;
    if (updateUserDto.role?.id) {
      const valid = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id));
      if (!valid) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { role: 'roleNotExists' },
        });
      }
      role = { id: updateUserDto.role.id };
    }

    let status: Status | undefined = undefined;
    if (updateUserDto.status?.id) {
      const valid = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id));
      if (!valid) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { status: 'statusNotExists' },
        });
      }
      status = { id: updateUserDto.status.id };
    }

    return this.usersRepository.update(id, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      role,
      status,
      provider: updateUserDto.provider,
    });
  }
}
