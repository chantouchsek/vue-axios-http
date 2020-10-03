import Vue from 'vue'
import VueApiQueries, { Validator, BaseProxy } from 'vue-api-queries'

export default function ({ $axios, app }, inject) {
  Vue.use(VueApiQueries)
  app.$errors = Validator
  BaseProxy.$http = $axios
  inject('queries', BaseProxy)
}
