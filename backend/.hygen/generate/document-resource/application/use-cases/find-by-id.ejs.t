---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/application/use-cases/find-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-by-id.use-case.ts
---
import { Injectable } from '@nestjs/common';
import { <%= name %>Repository } from '../../infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { NullableType } from '../../../utils/types/nullable.type';

@Injectable()
export class Find<%= name %>ByIdUseCase {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  execute(id: <%= name %>['id']): Promise<NullableType<<%= name %>>> {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findById(id);
  }
}
