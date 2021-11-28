import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateTokenInput } from '../dto/create-token.input';
import { RefreshTokenInput } from '../dto/refresh-token.input';
import { TokenResource } from '../resources/token.resource';
import { TokensService } from '../services/tokens.service';

@Resolver()
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @Mutation(() => TokenResource)
  async createToken(
    @Args('createTokenInput') createTokenInput: CreateTokenInput,
  ): Promise<TokenResource> {
    const data = await this.tokensService.createToken(createTokenInput);
    return new TokenResource({ data });
  }

  @Mutation(() => TokenResource)
  async refreshToken(
    @Args('refreshTokenInput')
    refreshTokenInput: RefreshTokenInput,
  ): Promise<TokenResource> {
    const data = await this.tokensService.refreshToken(refreshTokenInput);
    return new TokenResource({ data });
  }
}
