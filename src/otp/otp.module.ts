import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OtpRepository } from './repositories/otp.repository';
import { OtpResolver } from './resolvers/otp.resolver';
import { OtpService } from './services/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpRepository])],
  providers: [OtpResolver, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
