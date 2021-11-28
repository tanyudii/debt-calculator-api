import { Field, ObjectType } from '@nestjs/graphql';
import { DefaultName } from '@app/common/graphql/types/default-name.type';
import { Resource } from '@app/common/graphql/types/resource.type';

@ObjectType()
export class DefaultNameResource extends Resource<DefaultNameResource> {
  @Field(() => DefaultName)
  data: DefaultName;
}
