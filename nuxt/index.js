import { resolve, join } from 'path'

module.exports = function nuxtAxiosHttpModule(moduleOptions = {}) {
  const { axiosHttp = {} } = this.options
  const options = Object.assign({}, moduleOptions, axiosHttp)
  this.addPlugin({
    options,
    ssr: true,
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: join('vue-nuxt-axios.js'),
  })
  // this.options.build.transpile.push(/^escape-string-regexp/)
}

// required by nuxt
module.exports.meta = require('../package.json')
