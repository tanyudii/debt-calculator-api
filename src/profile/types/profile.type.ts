import { IUser } from '@app/common/interfaces/user.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile implements IUser {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  phoneNumber: string;
}
