import Vue from 'vue'
import AxiosHttp, { BaseService, Validator } from 'vue-axios-http'

const options = '<%= options %>'

Vue.use(AxiosHttp, options)

export default function ({ $axios }, inject) {
  BaseService.$http = $axios
  inject('errors', Validator)
}
