import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { CurrentUser } from '../../@common/decorators/current-user.decorator';
import { JwtGqlGuard } from '../../@common/guards/jwt-gql.guard';
import { IUser } from '../../@common/interfaces/user.interface';
import { ShoppingItem } from '../../shoppings/entities/shopping-items.entity';
import { Shopping } from '../../shoppings/entities/shopping.entity';
import { User } from '../../users/entities/user.entity';
import { CreatePaymentInput } from '../dto/create-payment.input';
import { UpdatePaymentInput } from '../dto/update-payment.input';
import { Payment } from '../entities/payment.entity';
import { PaymentsLoader } from '../loaders/payments.loader';
import { PaymentsService } from '../services/payments.service';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentsLoader: PaymentsLoader,
  ) {}

  @UseGuards(JwtGqlGuard)
  @Mutation(() => Payment)
  async createPayment(
    @CurrentUser() user: IUser,
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<Payment> {
    return this.paymentsService.create(user.id, createPaymentInput);
  }

  @UseGuards(JwtGqlGuard)
  @Query(() => [Payment], { name: 'payments' })
  findAll(@CurrentUser() user: IUser) {
    return this.paymentsService.findAll(user.id);
  }

  @UseGuards(JwtGqlGuard)
  @Query(() => Payment, { name: 'payment' })
  findOne(@CurrentUser() user: IUser, @Args('id') id: string) {
    return this.paymentsService.findOne(user.id, id);
  }

  @UseGuards(JwtGqlGuard)
  @Mutation(() => Payment)
  updatePayment(
    @CurrentUser() user: IUser,
    @Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput,
  ) {
    return this.paymentsService.update(
      user.id,
      updatePaymentInput.id,
      updatePaymentInput,
    );
  }

  @UseGuards(JwtGqlGuard)
  @Mutation(() => Payment)
  removePayment(@CurrentUser() user: IUser, @Args('id') id: string) {
    return this.paymentsService.remove(user.id, id);
  }

  @ResolveField('user', () => User)
  async getUser(@Parent() payment: Payment): Promise<User> {
    const { userId } = payment;
    return this.paymentsLoader.batchUsers.load(userId);
  }

  @ResolveField('paymentItems', () => [ShoppingItem])
  async getShoppingItem(@Parent() payment: Shopping) {
    const { id } = payment;
    return this.paymentsLoader.batchPaymentItems.load(id);
  }
}