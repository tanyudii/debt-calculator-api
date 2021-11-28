import { Resource } from '@app/common/graphql/types/resource.type';
import { Field, ObjectType } from '@nestjs/graphql';

import { TokenResponse } from '../types/token.type';

@ObjectType()
export class TokenResource extends Resource<TokenResource> {
  @Field(() => TokenResponse)
  data: TokenResponse;
}
