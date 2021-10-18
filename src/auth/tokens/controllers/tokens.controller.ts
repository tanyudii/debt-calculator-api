import { Body, Controller, Post } from '@nestjs/common';
import { CreateTokenInput } from '../dto/create-token.input';
import { TokensService } from '../services/tokens.service';
import { Token } from '../entities/token.entity';
import { CreateTokenByRefreshTokenInput } from '../dto/create-token-by-refresh-token.input';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('create')
  async createToken(
    @Body() createTokenInput: CreateTokenInput,
  ): Promise<Token> {
    return this.tokensService.create(createTokenInput);
  }

  @Post('refresh')
  async createRefreshToken(
    @Body() createTokenByRefreshTokenInput: CreateTokenByRefreshTokenInput,
  ): Promise<Token> {
    return this.tokensService.createByRefreshToken(
      createTokenByRefreshTokenInput,
    );
  }
}