import { GqlCurrentUser } from '@app/common/decorators/gql-current-user.decorator';
import { PaginationArg } from '@app/common/graphql/args/pagination.arg';
import { JwtGqlGuard } from '@app/common/guards/jwt-gql.guard';
import { IUser } from '@app/common/interfaces/user.interface';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateUserBankInput } from '../dto/create-user-bank.input';
import { UpdateUserBankInput } from '../dto/update-user-bank.input';
import { UserBankCollection } from '../resources/user-bank.collection';
import { UserBankResource } from '../resources/user-bank.resource';
import { UserBanksService } from '../services/user-banks.service';

@Resolver(() => UserBankResource)
export class UserBanksResolver {
  constructor(private readonly userBanksService: UserBanksService) {}

  @UseGuards(JwtGqlGuard)
  @Query(() => UserBankCollection, { name: 'userBanks' })
  async findAll(
    @GqlCurrentUser() currentUser: IUser,
    @Args() paginationArg: PaginationArg,
  ): Promise<UserBankCollection> {
    const { items: data, meta } = await this.userBanksService.findAllPagination(
      currentUser.id,
      paginationArg,
    );

    return new UserBankCollection({ data, meta });
  }

  @UseGuards(JwtGqlGuard)
  @Query(() => UserBankResource, { name: 'userBank' })
  async findOne(
    @GqlCurrentUser() currentUser: IUser,
    @Args('id') id: string,
  ): Promise<UserBankResource> {
    const data = await this.userBanksService.findOne(currentUser.id, id);
    return new UserBankResource({ data });
  }

  @UseGuards(JwtGqlGuard)
  @Mutation(() => UserBankResource)
  async createUserBank(
    @GqlCurrentUser() currentUser: IUser,
    @Args('createUserBankInput') createUserBankInput: CreateUserBankInput,
  ): Promise<UserBankResource> {
    const data = await this.userBanksService.create(
      currentUser.id,
      createUserBankInput,
    );
    return new UserBankResource({ data });
  }

  @UseGuards(JwtGqlGuard)
  @Mutation(() => UserBankResource)
  async updateUserBank(
    @GqlCurrentUser() currentUser: IUser,
    @Args('updateUserBankInput') updateUserBankInput: UpdateUserBankInput,
  ): Promise<UserBankResource> {
    const data = await this.userBanksService.update(
      currentUser.id,
      updateUserBankInput.id,
      updateUserBankInput,
    );
    return new UserBankResource({ data });
  }

  @UseGuards(JwtGqlGuard)
  @Mutation(() => UserBankResource)
  async removeUserBank(
    @GqlCurrentUser() currentUser: IUser,
    @Args('id') id: string,
  ): Promise<UserBankResource> {
    const data = await this.userBanksService.remove(currentUser.id, id);
    return new UserBankResource({ data });
  }
}
