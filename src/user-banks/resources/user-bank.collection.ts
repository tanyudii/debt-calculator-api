import { Collection } from '@app/common/graphql/types/collection.type';
import { Field, ObjectType } from '@nestjs/graphql';

import { UserBank } from '../entities/user-bank.entity';

@ObjectType()
export class UserBankCollection extends Collection<UserBankCollection> {
  @Field(() => [UserBank])
  data: UserBank[];
}
