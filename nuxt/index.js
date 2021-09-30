import { resolve, join } from 'path'

module.exports = function nuxtVueApiQueriesModule(moduleOptions = {}) {
  const { apiQueries = {} } = this.options
  const options = Object.assign({}, moduleOptions, apiQueries)
  this.addPlugin({
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: join('vue-api-queries.js'),
    options,
  })
  this.options.build.transpile.push(/^escape-string-regexp/)
}

// required by nuxt
module.exports.meta = require('../package.json')
