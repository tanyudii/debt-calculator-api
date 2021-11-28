import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { CreateUserBankInput } from '../dto/create-user-bank.input';
import { UpdateUserBankInput } from '../dto/update-user-bank.input';
import { UserBank } from '../entities/user-bank.entity';
import { UserBankRepository } from '../repositories/user-bank.repository';

@Injectable()
export class UserBanksService {
  constructor(private readonly userBankRepository: UserBankRepository) {}

  async findAll(userId: string): Promise<UserBank[]> {
    return this.userBankRepository.my(userId, 'userBanks').getMany();
  }

  async findAllPagination(
    userId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<UserBank>> {
    const queryBuilder = this.userBankRepository
      .my(userId, 'userBanks')
      .orderBy('userBanks.createdAt', 'DESC');

    return paginate<UserBank>(queryBuilder, options);
  }

  async findOne(userId: string, id: string): Promise<UserBank> {
    const userBank = await this.userBankRepository.findOne({ userId, id });
    if (!userBank) {
      throw new NotFoundException();
    }

    return userBank;
  }

  async create(
    userId: string,
    createUserBankInput: CreateUserBankInput,
  ): Promise<UserBank> {
    const { bankName, bankNumber } = createUserBankInput;
    return this.userBankRepository.save({
      userId,
      bankName,
      bankNumber,
    });
  }

  async update(
    userId: string,
    id: string,
    updateUserBankInput: UpdateUserBankInput,
  ): Promise<UserBank> {
    const userBank = await this.userBankRepository.findOne({ userId, id });
    if (!userBank) {
      throw new NotFoundException();
    }

    const { bankName, bankNumber } = updateUserBankInput;
    return this.userBankRepository.save({
      ...userBank,
      userId,
      bankName,
      bankNumber,
    });
  }

  async remove(userId: string, id: string): Promise<UserBank> {
    const userBank = await this.userBankRepository.findOne({ userId, id });

    if (!userBank) {
      throw new NotFoundException();
    }

    await this.userBankRepository.softDelete({ id });

    return userBank;
  }
}
