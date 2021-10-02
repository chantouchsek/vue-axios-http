import { resolve, join } from 'path'

module.exports = function nuxtVueApiQueriesModule(moduleOptions = {}) {
  const { apiQueries = {}, dev } = this.options
  const defaultOpts = {
    debug: dev,
    onPageChange: true,
    blockByDefault: true,
    headerBlockerKey: '',
  }
  const options = Object.assign(defaultOpts, moduleOptions, apiQueries)
  this.addPlugin({
    options,
    ssr: true,
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: join('vue-api-queries.js'),
  })
  this.options.build.transpile.push(/^escape-string-regexp/)
}

// required by nuxt
module.exports.meta = require('../package.json')
