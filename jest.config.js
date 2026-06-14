export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ['**/src/__tests__/**/*.(test|spec).jsx?'],
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom'
  }
};
