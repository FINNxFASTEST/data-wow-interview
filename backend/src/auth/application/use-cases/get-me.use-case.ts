import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../utils/types/nullable.type';
import { User } from '../../../users/domain/user';
import { JwtPayloadType } from '../../strategies/types/jwt-payload.type';
import { FindUserByIdUseCase } from '../../../users/application/use-cases/find-user-by-id.use-case';

@Injectable()
export class GetMeUseCase {
  constructor(private readonly findUserById: FindUserByIdUseCase) {}

  execute(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.findUserById.execute(userJwtPayload.id);
  }
}
