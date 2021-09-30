import Vue from 'vue'
import VueApiQueries, { Validator } from 'vue-api-queries'

const options = <%= serialize(options) %> || {}
const { errorProperty, parsedQs } = options

export default function ({ $axios }, inject) {
  Vue.use(VueApiQueries, { errorProperty, axios: $axios, parsedQs })
  inject('errors', Validator)
}
