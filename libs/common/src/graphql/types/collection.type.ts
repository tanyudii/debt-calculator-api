import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMeta } from '@app/common/graphql/types/pagination-meta.type';
import { Resource } from '@app/common/graphql/types/resource.type';

@ObjectType()
export class Collection<T> extends Resource<T> {
  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
