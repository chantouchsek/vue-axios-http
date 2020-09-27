export default function ({ $axios, $config: { apiHost } }) {
  $axios.defaults.baseURL = apiHost
  $axios.onRequest((config) => {
    config.headers.common.Accept = 'application/json'
    config.headers.common['Accept-Language'] = 'en'
  })
}
