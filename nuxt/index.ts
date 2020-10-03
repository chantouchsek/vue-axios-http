import { resolve, join } from 'path'
import merge from 'lodash.merge'

module.exports = function nuxtVueFormValidatorModule(moduleOptions = {}) {
  const { apiQueries = {} } = this.options
  const options = merge({}, moduleOptions, apiQueries)
  this.addPlugin({
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: join('vue-api-queries.js'),
    options,
  })
  this.options.build.transpile.push(/^escape-string-regexp/)
}

// required by nuxt
module.exports.meta = require('../package.json')
