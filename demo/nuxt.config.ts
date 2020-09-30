const prefix = process.env.API_PREFIX

export default {
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
  },
  publicRuntimeConfig: {},
  privateRuntimeConfig: {
    axios: {
      baseURL: `${process.env.API_URL}${prefix || '/'}`,
    },
  },
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
    debug: process.env.NODE_ENV !== 'production',
    credential: true,
  },
  proxy: {
    '/api': {
      target: `${process.env.API_URL}${prefix || '/'}`,
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
