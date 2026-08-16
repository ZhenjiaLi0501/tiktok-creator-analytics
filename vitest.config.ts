import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/lib/format.ts',
        'src/lib/utils.ts',
        'src/components/common/empty-state.tsx',
        'src/features/creator-assistant/components/creator-assistant-category-trend-section.tsx',
        'src/features/creator-assistant/components/creator-assistant-publish-time-section.tsx',
        'src/features/creator-assistant/components/creator-assistant-suggestion-section.tsx',
        'src/features/creator-assistant/components/creator-assistant-title-keyword-section.tsx',
      ],
      exclude: ['src/**/*.d.ts', 'src/test/**', 'src/mocks/**', 'src/app/**', '**/*.config.*'],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
