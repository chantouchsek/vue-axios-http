import Vue from 'vue'
import VueApiQueries, { Validator } from '../../src'

export default function (ctx, inject) {
  Vue.use(VueApiQueries)
  ctx.$errors = new Validator()
  inject('$errors', new Validator())
}
