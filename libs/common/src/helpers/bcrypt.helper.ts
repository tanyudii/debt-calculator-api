import { compare, genSalt, hash } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, await genSalt(10));
};

export const comparePassword = async (
  hashedPassword: string,
  password: string,
): Promise<boolean> => {
  return compare(password, hashedPassword);
};
