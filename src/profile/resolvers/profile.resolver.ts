import { GqlCurrentUser } from '@app/common/decorators/gql-current-user.decorator';
import { JwtGqlGuard } from '@app/common/guards/jwt-gql.guard';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { ProfileResource } from '../resources/profile.resource';
import { Profile } from '../types/profile.type';

@Resolver(() => Profile)
export class ProfileResolver {
  @UseGuards(JwtGqlGuard)
  @Query(() => ProfileResource)
  myProfile(@GqlCurrentUser() profile: Profile): ProfileResource {
    return new ProfileResource({ data: profile });
  }
}
