import { DefaultMessageResource } from '@app/common/graphql/types/default-message-resource.type';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ForgotPasswordInput } from '../dto/forgot-password.input';
import { ResetPasswordInput } from '../dto/reset-password.input';
import { PasswordsService } from '../services/passwords.service';

@Resolver()
export class PasswordsResolver {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Mutation(() => DefaultMessageResource)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<DefaultMessageResource> {
    const data = await this.passwordsService.forgotPassword(
      forgotPasswordInput,
    );
    return new DefaultMessageResource({ data });
  }

  @Mutation(() => DefaultMessageResource)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<DefaultMessageResource> {
    const data = await this.passwordsService.resetPassword(resetPasswordInput);
    return new DefaultMessageResource({ data });
  }
}
