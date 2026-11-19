// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    env: { VITE_API_URL: 'http://localhost:3000' },
    reporters: ['default', 'junit'],
    outputFile: { junit: './reports/web-junit.xml' },
    coverage: {
      provider: 'v8',
      include: [
        'src/App.tsx',
        'src/api/todosApi.ts',
        'src/components/TodoItem.tsx',
        'src/components/TodoList.tsx',
      ],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: { lines: 60, statements: 60, functions: 60, branches: 60 },
    },
  },
});
