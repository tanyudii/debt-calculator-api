import {
  comparePassword,
  hashPassword,
} from '@app/common/helpers/bcrypt.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as gravatar from 'gravatar';

import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllByIds(ids: string[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({ phoneNumber });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user || !(await comparePassword(user.password, password))) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByPhoneNumberAndPassword(
    phoneNumber: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ phoneNumber });
    if (!user || !(await comparePassword(user.password, password))) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { name, phoneNumber, email, password, avatar } = createUserInput;

    const gravatarUrl = email
      ? gravatar.url(email, { protocol: 'https', s: '200', d: 'mm' })
      : null;

    return this.userRepository.save({
      name,
      phoneNumber,
      email,
      avatar: avatar || gravatarUrl,
      ...(password ? { password: await hashPassword(password) } : {}),
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException();
    }

    const { name, email, phoneNumber, avatar } = updateUserInput;
    return this.userRepository.save({
      ...user,
      name,
      email,
      phoneNumber,
      avatar,
    });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException();
    }

    return this.userRepository.save({
      ...user,
      password: await hashPassword(password),
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return this.userRepository.softRemove(user);
  }
}
