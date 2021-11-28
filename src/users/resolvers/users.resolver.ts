import { DefaultObjectResource } from '@app/common/graphql/types/default-object-resource.type';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { UsersService } from '../services/users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => DefaultObjectResource)
  async getUserIDByPhoneNumber(
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<DefaultObjectResource> {
    const { id, name } = await this.usersService.findOneByPhoneNumber(
      phoneNumber,
    );

    return new DefaultObjectResource({ data: { id, name } });
  }

  @Query(() => DefaultObjectResource)
  async getUserIDByEmail(
    @Args('email') email: string,
  ): Promise<DefaultObjectResource> {
    const { id, name } = await this.usersService.findOneByEmail(email);

    return new DefaultObjectResource({ data: { id, name } });
  }
}
