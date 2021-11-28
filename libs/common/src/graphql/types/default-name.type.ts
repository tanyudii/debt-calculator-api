import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultName {
  @Field()
  name: string;
}
