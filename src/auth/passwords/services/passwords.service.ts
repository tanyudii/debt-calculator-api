import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgotPasswordInput } from '../dto/forgot-password.input';
import { PasswordResetsService } from '../../password-resets/services/password-resets.service';
import { PasswordMessage } from '../entities/password-message.entity';
import { UsersService } from '../../../users/services/users.service';
import { ResetPasswordInput } from '../dto/reset-password.input';

@Injectable()
export class PasswordsService {
  constructor(
    private readonly passwordResetsService: PasswordResetsService,
    private readonly usersService: UsersService,
  ) {}

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<PasswordMessage> {
    const { email } = forgotPasswordInput;
    try {
      const user = await this.usersService.findOneByEmail(email);

      await this.passwordResetsService.create({
        userId: user.id,
        email: user.email,
      });

      // todo: send email from created password reset token
    } catch (e) {}

    return this.passwordMessageFactory(
      "We'll send the password reset when the email is registered.",
    );
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<PasswordMessage> {
    const { email, token, password } = resetPasswordInput;

    const isValidPasswordReset = await this.passwordResetsService.isValidExpiry(
      token,
      email,
    );

    if (!isValidPasswordReset) {
      throw new BadRequestException('The password token is invalid.');
    }

    const user = await this.usersService.findOneByEmail(email);

    await Promise.all([
      this.passwordResetsService.remove(token),
      this.usersService.updatePassword(user.id, password),
    ]);

    return this.passwordMessageFactory('Successfully update password.');
  }

  passwordMessageFactory(message = 'Success'): PasswordMessage {
    const passwordMessage = new PasswordMessage();
    passwordMessage.message = message;
    return passwordMessage;
  }
}