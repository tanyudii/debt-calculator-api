import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OtpModule } from '../../otp/otp.module';
import { UsersModule } from '../../users/users.module';
import { AccessTokensModule } from '../access-tokens/access-tokens.module';
import { AccessTokenRepository } from '../access-tokens/repositories/access-token.repository';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { RefreshTokenRepository } from '../refresh-tokens/repositories/refresh-token.repository';
import { TokensResolver } from './resolvers/tokens.resolver';
import { TokensService } from './services/tokens.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    TypeOrmModule.forFeature([AccessTokenRepository, RefreshTokenRepository]),
    AccessTokensModule,
    RefreshTokensModule,
    UsersModule,
    OtpModule,
  ],
  providers: [TokensResolver, TokensService],
})
export class TokensModule {}
