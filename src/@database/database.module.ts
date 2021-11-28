import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AccessToken } from '../auth/access-tokens/entities/access-token.entity';
import { PasswordReset } from '../auth/password-resets/entities/password-reset.entity';
import { RefreshToken } from '../auth/refresh-tokens/entities/refresh-token.entity';
import { Otp } from '../otp/entities/otp.entity';
import { UserBank } from '../user-banks/entities/user-bank.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction: boolean =
          configService.get<string>('NODE_ENV') == 'production';

        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: !isProduction,
          dropSchema: false,
          logging: false,
          entities: [
            AccessToken,
            PasswordReset,
            RefreshToken,
            Otp,
            UserBank,
            User,
          ],
          timezone: '+00:00',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
