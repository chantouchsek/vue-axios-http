import Vue from 'vue'
import VueApiQueries, { Validator, BaseProxy } from 'vue-api-queries'

const errorProperty = '<%= options.errorProperty %>'

export default function (ctx) {
  Vue.use(VueApiQueries)
  ctx.$errors = Validator
  BaseProxy.$http = ctx.$axios
  BaseProxy.$errorProperty = errorProperty || 'errors'
  // inject('queries', BaseProxy)
}
