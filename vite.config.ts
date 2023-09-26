import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    deps: {
      interopDefault: true,
    },
    environment: 'jsdom',
  },
})
