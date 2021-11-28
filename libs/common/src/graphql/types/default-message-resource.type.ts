import { Field, ObjectType } from '@nestjs/graphql';
import { DefaultMessage } from '@app/common/graphql/types/default-message.type';
import { Resource } from '@app/common/graphql/types/resource.type';

@ObjectType()
export class DefaultMessageResource extends Resource<DefaultMessageResource> {
  @Field(() => DefaultMessage)
  data: DefaultMessage;
}
