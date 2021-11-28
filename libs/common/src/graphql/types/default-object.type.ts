import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultObject {
  @Field()
  id: string;

  @Field()
  name: string;
}
