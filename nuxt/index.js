import { resolve, join } from 'node:path'

module.exports = function nuxtAxiosHttpModule(moduleOptions = {}) {
  const { axiosHttp = {} } = this.options
  const options = Object.assign({}, moduleOptions, axiosHttp)
  this.addPlugin({
    options,
    ssr: true,
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: join('vue-nuxt-axios.js'),
  })
}

// required by nuxt
module.exports.meta = require('../package.json')
