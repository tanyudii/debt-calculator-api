import { Field, ObjectType } from "@nestjs/graphql";
import { Resource } from "@app/common/graphql/types/resource.type";
import { DefaultObject } from "@app/common/graphql/types/default-object.type";

@ObjectType()
export class DefaultObjectResource extends Resource<DefaultObjectResource> {
  @Field(() => {
    return DefaultObject;
  })
  data: DefaultObject;
}
