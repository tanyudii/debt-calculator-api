import { Resource } from '@app/common/graphql/types/resource.type';
import { Field, ObjectType } from '@nestjs/graphql';

import { Profile } from '../types/profile.type';

@ObjectType()
export class ProfileResource extends Resource<ProfileResource> {
  @Field(() => Profile)
  data: Profile;
}
