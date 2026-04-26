import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { User } from '../../domain/user';
import {
  FilterUserDto,
  SortUserDto,
} from '../../presentation/dto/query-user.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

@Injectable()
export class FindUsersUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  execute({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
