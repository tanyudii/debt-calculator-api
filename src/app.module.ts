import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { DatabaseModule } from './@database/database.module';
import { MailerModule } from './@mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ProfileModule } from './profile/profile.module';
import { UserBanksModule } from './user-banks/user-banks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    DatabaseModule,
    MailerModule,
    AuthModule,
    UsersModule,
    UserBanksModule,
    OtpModule,
    ProfileModule,
  ],
})
export class AppModule {}
