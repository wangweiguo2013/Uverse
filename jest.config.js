module.exports = {
  collectCoverageFrom: ['src/**/*.{ts}'],
  // setupFiles: ['<rootDir>/__tests__/setup.ts'],
  testMatch: ['<rootDir>/test/**/?(*.)(spec|test).ts'],
  // testEnvironment: 'node',
  testEnvironmentOptions:{
    url: 'http://localhost:4444'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/packages/$1'
  },
  moduleFileExtensions: ['js', 'ts'],
  globals: {
    'ts-jest': {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      tsconfig: require('path').join(process.cwd(), 'tsconfig.json')
    }
  }
}
