import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetsService } from './services/password-resets.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  providers: [PasswordResetsService],
  exports: [PasswordResetsService],
})
export class PasswordResetsModule {}
