module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
};