---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/application/use-cases/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.use-case.ts
---
import { Injectable } from '@nestjs/common';
import { <%= name %>Repository } from '../../infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { Create<%= name %>Dto } from '../../presentation/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

@Injectable()
export class Create<%= name %>UseCase {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(dto: Create<%= name %>Dto): Promise<<%= name %>> {
    // Do not remove comment below.
    // <creating-property />
    return this.<%= h.inflection.camelize(name, true) %>Repository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    } as Omit<<%= name %>, 'id' | 'createdAt' | 'updatedAt'>);
  }
}
