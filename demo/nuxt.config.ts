export default {
  server: {
    port: 5000,
    host: 'localhost',
  },
  publicRuntimeConfig: {},
  privateRuntimeConfig: {},
  build: {
    extractCSS: true,
  },
  plugins: ['~/plugins/axios'],
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt',
    'vue-api-queries/nuxt',
  ],
  axios: {
    proxy: true,
    retry: {
      retries: 3,
    },
    debug: process.env.NODE_ENV !== 'production',
  },
  proxy: {
    '/api': {
      target: process.env.API_HOST,
      pathRewrite: {
        '^/api': '/',
      },
      ws: true,
    },
  },
  auth: {
    redirect: {
      callback: '/callback',
      logout: '/signed-out',
    },
    strategies: {
      local: {
        token: {
          property: 'access_token',
        },
        user: {
          property: 'data',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/me', method: 'get' },
        },
      },
    },
    plugins: [{ src: '~/plugins/axios', ssr: true }],
  },
}
