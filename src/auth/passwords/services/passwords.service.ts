import { DefaultMessage } from '@app/common/graphql/types/default-message.type';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersService } from '../../../users/services/users.service';
import { PasswordResetsService } from '../../password-resets/services/password-resets.service';
import { ForgotPasswordInput } from '../dto/forgot-password.input';
import { ResetPasswordInput } from '../dto/reset-password.input';

@Injectable()
export class PasswordsService {
  constructor(
    private readonly passwordResetsService: PasswordResetsService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<DefaultMessage> {
    const { email, url } = forgotPasswordInput;
    const urlObj = new URL(url);

    try {
      const user = await this.usersService.findOneByEmail(email);

      const passwordReset = await this.passwordResetsService.create({
        userId: user.id,
        email: user.email,
      });

      urlObj.searchParams.set('token', passwordReset.id);

      await this.mailerService.sendMail({
        to: `${user.name} <${user.email}>`,
        subject: 'Password Reset',
        html: `
          <p>Click Here for Reset </p>
          <a href="${urlObj.toString()}">Reset Password</a>
        `,
      });
    } catch (e) {}

    return this.passwordMessageFactory(
      'We have send password reset link to registered email!',
    );
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<DefaultMessage> {
    const { email, token, password } = resetPasswordInput;

    const isValidPasswordReset = await this.passwordResetsService.isValidExpiry(
      token,
      email,
    );

    if (!isValidPasswordReset) {
      throw new BadRequestException('The password reset token is invalid.');
    }

    const user = await this.usersService.findOneByEmail(email);

    await Promise.all([
      this.passwordResetsService.remove(token),
      this.usersService.updatePassword(user.id, password),
    ]);

    return this.passwordMessageFactory('Your password has been reset!');
  }

  protected passwordMessageFactory(message = 'Success'): DefaultMessage {
    const passwordMessage = new DefaultMessage();
    passwordMessage.message = message;
    return passwordMessage;
  }
}
