import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { NullableType } from '../../../utils/types/nullable.type';
import { User } from '../../../users/domain/user';
import { AuthUpdateDto } from '../../dto/auth-update.dto';
import { JwtPayloadType } from '../../strategies/types/jwt-payload.type';
import { FindUserByIdUseCase } from '../../../users/application/use-cases/find-user-by-id.use-case';
import { FindUserByEmailUseCase } from '../../../users/application/use-cases/find-user-by-email.use-case';
import { UpdateUserUseCase } from '../../../users/application/use-cases/update-user.use-case';
import { DeleteSessionsByUserIdExcludingUseCase } from '../../../session/application/use-cases/delete-sessions-by-user-id-excluding.use-case';

@Injectable()
export class UpdateMeUseCase {
  constructor(
    private readonly findUserById: FindUserByIdUseCase,
    private readonly findUserByEmail: FindUserByEmailUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteSessionsByUserIdExcluding: DeleteSessionsByUserIdExcludingUseCase,
  ) {}

  async execute(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.findUserById.execute(userJwtPayload.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { user: 'userNotFound' },
      });
    }

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { oldPassword: 'missingOldPassword' },
        });
      }

      if (!currentUser.password) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { oldPassword: 'incorrectOldPassword' },
        });
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { oldPassword: 'incorrectOldPassword' },
        });
      } else {
        await this.deleteSessionsByUserIdExcluding.execute({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.findUserByEmail.execute(userDto.email);
      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { email: 'emailExists' },
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { oldPassword: _removed, ...updatePayload } = userDto;
    await this.updateUser.execute(userJwtPayload.id, updatePayload);

    return this.findUserById.execute(userJwtPayload.id);
  }
}
