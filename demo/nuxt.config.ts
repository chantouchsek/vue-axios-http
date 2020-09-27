import vueApiQueryModule from '../nuxt'

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
    '@nuxtjs/proxy',
    'bootstrap-vue/nuxt',
    vueApiQueryModule,
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
    redirect: false,
    strategies: {
      local: false,
      admin: {
        token: {
          property: 'access_token',
          required: true,
          type: 'Bearer',
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/api/admins/login', method: 'post' },
          logout: { url: '/api/admins/logout', method: 'post' },
          user: { url: '/api/admins/user', method: 'get' },
        },
        isDefault: true,
        redirect: {
          callback: '/admin/callback',
          logout: '/admin/signed-out',
          home: '/admin/secure',
          login: '/admin/login',
        },
      },
      staff: {
        token: {
          property: 'access_token',
          required: true,
          type: 'Bearer',
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/api/users/login', method: 'post' },
          logout: { url: '/api/users/logout', method: 'post' },
          user: { url: '/api/users/user', method: 'get' },
        },
        isDefault: true,
        redirect: {
          callback: '/staff/callback',
          logout: '/staff/signed-out',
          home: '/staff/secure',
          login: '/staff/login',
        },
      },
    },
    plugins: [{ src: '~/plugins/axios', ssr: true }],
  },
}
