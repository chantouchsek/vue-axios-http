import type { ValidatorType } from './core/Validator'
import BaseProxy from './core/BaseProxy'
import Validator from './core/Validator'
import BaseTransformer from './core/BaseTransformer'
import PaginationTransformer from './core/PaginationTransformer'
import merge from 'lodash.merge'

// augment typings of Vue.js
import './vue'

export type Errors = ValidatorType
export type { ValidatorType }

class VueApiQueries {
  installed = false
  install(Vue: any, options: any = {}) {
    if (this.installed) return
    this.installed = true
    const defaultOption = merge(options, {
      parsedQs: {
        comma: true,
        allowDots: true,
        ignoreQueryPrefix: true,
      },
      errorProperty: 'errors',
    })
    const { axios, errorProperty, parsedQs } = defaultOption
    BaseProxy.$http = axios
    BaseProxy.$errorProperty = errorProperty || 'errors'
    BaseProxy.$parsedQs = parsedQs
    Vue.mixin({
      beforeCreate() {
        this.$options.$errors = {}
        Vue.util.defineReactive(this.$options, '$errors', Validator)
        if (!this.$options.computed) {
          this.$options.computed = {}
        }
        this.$options.computed.$errors = function () {
          return this.$options.$errors
        }
      },
    })
  }
}
export {
  Validator,
  BaseProxy,
  BaseTransformer,
  PaginationTransformer,
  BaseProxy as BaseService,
}
export * from './util'
export default new VueApiQueries()
