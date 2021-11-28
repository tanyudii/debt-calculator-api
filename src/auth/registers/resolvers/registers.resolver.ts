import { DefaultMessageResource } from '@app/common/graphql/types/default-message-resource.type';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RegisterInput } from '../dto/register.input';
import { RegistersService } from '../services/registers.service';

@Resolver()
export class RegistersResolver {
  constructor(private readonly registersService: RegistersService) {}

  @Mutation(() => DefaultMessageResource)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<DefaultMessageResource> {
    const data = await this.registersService.register(registerInput);
    return new DefaultMessageResource({ data });
  }
}
