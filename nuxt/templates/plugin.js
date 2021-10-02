import Vue from 'vue'
import VueApiQueries, { Validator } from 'vue-api-queries'

const errorProperty = '<%= options.errorProperty %>'
const parsedQs = '<%= options.parsedQs %>'

export default function ({ $axios }, inject) {
  Vue.use(VueApiQueries, { errorProperty, $axios, parsedQs })
  inject('errors', Validator)
}
