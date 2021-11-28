import { Resource } from '@app/common/graphql/types/resource.type';
import { Field, ObjectType } from '@nestjs/graphql';

import { UserBank } from '../entities/user-bank.entity';

@ObjectType()
export class UserBankResource extends Resource<UserBankResource> {
  @Field(() => UserBank)
  data: UserBank;
}
