import Vue from 'vue'
import AxiosHttp, { BaseProxy, Validator } from 'vue-axios-http'

const errorProperty = '<%= options.errorProperty %>'
const parsedQs = '<%= options.parsedQs %>'

Vue.use(AxiosHttp, { errorProperty: errorProperty, parsedQs })

export default function ({ $axios }, inject) {
  BaseProxy.$http = $axios
  inject('errors', Validator)
}
