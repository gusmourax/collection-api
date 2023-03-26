export default {
  bail: 1,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@utils/(.*)': '<rootDir>/src/app/utils/$1',
    '@modules/(.*)': '<rootDir>/src/app/modules/$1',
  },
};
