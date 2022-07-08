import type { ValidatorType } from './core/Validator'
import BaseService from './core/BaseService'
import Validator from './core/Validator'
import { merge } from 'lodash'
import _Vue from 'vue'

// augment typings of Vue.js
import './vue'

export type Errors = ValidatorType
export type { ValidatorType }

class AxiosHttp {
  installed = false
  parsedQs = {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  }
  install(Vue: typeof _Vue, options: Record<string, any> = {}) {
    if (this.installed) return
    this.installed = true
    const defaultOption = merge(
      {
        parsedQs: this.parsedQs,
        errorProperty: 'errors',
      },
      options,
    )
    const { $axios, errorProperty, parsedQs } = defaultOption
    BaseService.$http = $axios
    BaseService.$errorProperty = errorProperty || 'errors'
    BaseService.$parsedQs = parsedQs || this.parsedQs
    Vue.mixin({
      beforeCreate() {
        this.$options.$errors = {} as any
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Vue.util.defineReactive(this.$options, '$errors', Validator)
        if (!this.$options.computed) {
          this.$options.computed = {}
        }
        this.$options.computed.$errors = function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return this.$options.$errors
        }
      },
    })
  }
}
export { Validator, BaseService }
export * from './util'
export default new AxiosHttp()
