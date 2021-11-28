import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultMessage {
  @Field()
  message: string;
}
