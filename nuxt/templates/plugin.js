import Vue from 'vue'
import AxiosHttp, { BaseService, Validator } from 'vue-axios-http'

const resetParameter = '<%= options.resetParameter %>'
const errorProperty = '<%= options.errorProperty %>'
const parsedQs = '<%= options.parsedQs %>'

Vue.use(AxiosHttp, { errorProperty, parsedQs, resetParameter })

export default function ({ $axios }, inject) {
  BaseService.$http = $axios
  inject('errors', Validator)
}
