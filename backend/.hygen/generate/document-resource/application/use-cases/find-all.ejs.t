---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/application/use-cases/find-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.use-case.ts
---
import { Injectable } from '@nestjs/common';
import { <%= name %>Repository } from '../../infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

@Injectable()
export class Find<%= h.inflection.transform(name, ['pluralize']) %>UseCase {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  execute(paginationOptions: IPaginationOptions): Promise<<%= name %>[]> {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findAllWithPagination({
      paginationOptions,
    });
  }
}
