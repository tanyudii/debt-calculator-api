import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../../@database/database.module';
import { RegistersResolver } from './registers.resolver';
import { RegistersService } from '../services/registers.service';
import { UsersModule } from '../../../users/users.module';

describe('RegistersResolver', () => {
  let resolver: RegistersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UsersModule],
      providers: [RegistersResolver, RegistersService],
    }).compile();

    resolver = module.get<RegistersResolver>(RegistersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});