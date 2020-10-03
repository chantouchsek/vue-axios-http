import Vue from 'vue'
import VueApiQueries, { Validator, BaseProxy } from 'vue-api-queries'

export default function (ctx, inject) {
  Vue.use(VueApiQueries)
  ctx.$errors = Validator
  BaseProxy.$http = ctx.$axios
  inject('queries', BaseProxy)
}
