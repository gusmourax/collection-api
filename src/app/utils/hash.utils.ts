import bcrypt from 'bcrypt';

export const hash = (str: string, salt?: number): string => {
  return bcrypt.hashSync(str, salt || 10);
};

export const compareHash = (str: string, hash: string): boolean => {
  return bcrypt.compareSync(str, hash);
};
