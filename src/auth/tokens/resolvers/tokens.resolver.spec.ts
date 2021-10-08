import { Test, TestingModule } from '@nestjs/testing';
import { TokensResolver } from './tokens.resolver';
import { DatabaseModule } from '../../../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import {
  jwtExpiresIn,
  jwtSecret,
} from '../../../common/constants/jwt.constant';
import { UsersModule } from '../../../users/users.module';
import { AccessTokensModule } from '../../access-tokens/access-tokens.module';
import { RefreshTokensModule } from '../../refresh-tokens/refresh-tokens.module';
import { TokensService } from '../services/tokens.service';

describe('TokensResolver', () => {
  let resolver: TokensResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        JwtModule.register({
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiresIn },
        }),
        AccessTokensModule,
        RefreshTokensModule,
        UsersModule,
      ],
      providers: [TokensService, TokensResolver],
    }).compile();

    resolver = module.get<TokensResolver>(TokensResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
