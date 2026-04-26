---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/presentation/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { <%= name %> } from '../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto } from './dto/find-all-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.dto';
import { Create<%= name %>UseCase } from '../application/use-cases/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case';
import { Find<%= h.inflection.transform(name, ['pluralize']) %>UseCase } from '../application/use-cases/find-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.use-case';
import { Find<%= name %>ByIdUseCase } from '../application/use-cases/find-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-by-id.use-case';
import { Update<%= name %>UseCase } from '../application/use-cases/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case';
import { Remove<%= name %>UseCase } from '../application/use-cases/remove-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case';

@ApiTags('<%= h.inflection.transform(name, ['pluralize', 'humanize']) %>')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: '<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>',
  version: '1',
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Controller {
  constructor(
    private readonly create<%= name %>: Create<%= name %>UseCase,
    private readonly find<%= h.inflection.transform(name, ['pluralize']) %>: Find<%= h.inflection.transform(name, ['pluralize']) %>UseCase,
    private readonly find<%= name %>ById: Find<%= name %>ByIdUseCase,
    private readonly update<%= name %>: Update<%= name %>UseCase,
    private readonly remove<%= name %>: Remove<%= name %>UseCase,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: <%= name %> })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: Create<%= name %>Dto) {
    return this.create<%= name %>.execute(dto);
  }

  @Get()
  @ApiOkResponse({ type: InfinityPaginationResponse(<%= name %>) })
  async findAll(
    @Query() query: FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto,
  ): Promise<InfinityPaginationResponseDto<<%= name %>>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    return infinityPagination(
      await this.find<%= h.inflection.transform(name, ['pluralize']) %>.execute({ page, limit }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: <%= name %> })
  findById(@Param('id') id: string) {
    return this.find<%= name %>ById.execute(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: <%= name %> })
  update(@Param('id') id: string, @Body() dto: Update<%= name %>Dto) {
    return this.update<%= name %>.execute(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.remove<%= name %>.execute(id);
  }
}
