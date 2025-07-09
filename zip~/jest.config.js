import '@testing-library/jest-dom';

module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(js|jsx) $ ': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass) $ ': 'identity-obj-proxy',
      '^three/examples/jsm/(.*) $ ': 'three/examples/jsm/ $ 1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };