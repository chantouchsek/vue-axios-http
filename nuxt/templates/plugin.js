import Vue from 'vue'
import VueApiQueries, { Validator, BaseProxy } from 'vue-api-queries'

const errorsKeyName = '<%= options.errorsKeyName %>'

export default function (ctx, inject) {
  Vue.use(VueApiQueries)
  ctx.$errors = Validator
  BaseProxy.$http = ctx.$axios
  BaseProxy.$errorsKeyName = errorsKeyName || 'errors'
  inject('queries', BaseProxy)
}
