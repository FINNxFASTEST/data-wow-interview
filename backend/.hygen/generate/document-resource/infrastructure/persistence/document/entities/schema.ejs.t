---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema.ts
---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../utils/document-entity-helper';

export type <%= name %>SchemaDocument = HydratedDocument<<%= name %>SchemaClass>;

@Schema({
  collection: '<%= h.inflection.transform(name, ["pluralize", "underscore", "dasherize"]) %>',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class <%= name %>SchemaClass extends EntityDocumentHelper {
  // Add @Prop fields here

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const <%= name %>Schema = SchemaFactory.createForClass(<%= name %>SchemaClass);
