export default function ({ $axios }) {
  $axios.onRequest((config) => {
    if (!config.headers.common) {
      Object.assign(config.headers, { common: {} })
    }
    config.headers.common.Accept = 'application/json'
    config.headers.common['Accept-Language'] = 'en'
  })
}
