const path = require('path');
const { defineConfig } = require('vitest/config');

const coreSrc = path.resolve(__dirname, '../../packages/core/src');

module.exports = defineConfig({
  resolve: {
    alias: [
      { find: '@sourcer/core', replacement: coreSrc },
      { find: '@sourcer/core/', replacement: `${coreSrc}/` }
    ]
  },
  test: {
    environment: 'node',
    include: ['src/test/**/*.spec.ts'],
    minThreads: 1,
    maxThreads: 1,
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/test/**'],
      all: true
    }
  }
});
