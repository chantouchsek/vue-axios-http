import Vue from 'vue'
import VueApiQueries, { Validator, BaseProxy } from 'vue-api-queries'

const errorsKey = '<%= options.errorsKeyName %>'

export default function (ctx) {
  Vue.use(VueApiQueries)
  ctx.$errors = Validator
  BaseProxy.$http = ctx.$axios
  BaseProxy.$errorsKey = errorsKey || 'errors'
  // inject('queries', BaseProxy)
}
