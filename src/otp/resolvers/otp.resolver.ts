import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateOtpInput } from '../dtos/create-otp.input';
import { Otp } from '../entities/otp.entity';
import { OtpResource } from '../resources/otp.resource';
import { OtpService } from '../services/otp.service';

@Resolver(() => Otp)
export class OtpResolver {
  constructor(private readonly otpService: OtpService) {}

  @Mutation(() => OtpResource)
  async createOtp(
    @Args('createOtpInput') createOtpInput: CreateOtpInput,
  ): Promise<OtpResource> {
    const data = await this.otpService.create(createOtpInput);
    return new OtpResource({ data });
  }
}
