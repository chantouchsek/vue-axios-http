import Vue from 'vue'
import VueApiQueries, { Validator } from 'vue-api-queries'

const options = <%= serialize(options) %> || {}
const { errorProperty, parsedQs } = options

export default function (ctx) {
  Vue.use(VueApiQueries, { errorProperty, axios: ctx.$axios, parsedQs })
  ctx.$errors = Validator
}
