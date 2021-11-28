import { DefaultMessage } from '@app/common/graphql/types/default-message.type';
import { BadRequestException, Injectable } from '@nestjs/common';

import { OtpService } from '../../../otp/services/otp.service';
import { UsersService } from '../../../users/services/users.service';
import { RegisterInput } from '../dto/register.input';

const otpSubjectTypeName = 'register_user';

@Injectable()
export class RegistersService {
  constructor(
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
  ) {}

  async register(registerInput: RegisterInput): Promise<DefaultMessage> {
    const { name, phoneNumber, otp, email, password } = registerInput;

    const isValidOtp = await this.otpService.isValidExpiry(
      otpSubjectTypeName,
      phoneNumber,
      phoneNumber,
      otp,
    );

    if (!isValidOtp) {
      throw new BadRequestException('otp is invalid.');
    }

    await this.usersService.create({
      name,
      phoneNumber,
      email,
      password,
    });

    await this.otpService.revoke(
      otpSubjectTypeName,
      phoneNumber,
      phoneNumber,
      otp,
    );

    return this.registerMessageFactory(`Hi ${name}`);
  }

  protected registerMessageFactory(message = 'Success'): DefaultMessage {
    const passwordMessage = new DefaultMessage();
    passwordMessage.message = message;
    return passwordMessage;
  }
}
