import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationQuery {
  @Field(() => Int, { nullable: true, defaultValue: 25 })
  limit: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page: number;
}
