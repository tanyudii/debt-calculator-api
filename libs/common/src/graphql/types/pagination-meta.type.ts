import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  itemCount: number;

  @Field(() => Int, { nullable: true })
  totalItems?: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int)
  currentPage: number;
}
