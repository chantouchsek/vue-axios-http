import type { ValidatorType } from './core/Validator'
import BaseProxy from './core/BaseProxy'
import Validator from './core/Validator'
import BaseTransformer from './core/BaseTransformer'
import PaginationTransformer from './core/PaginationTransformer'
import { merge } from './util'
import _Vue from 'vue'

// augment typings of Vue.js
import './vue'

export type Errors = ValidatorType
export type { ValidatorType }

class VueApiQueries {
  installed = false
  parsedQs = {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  }
  install(Vue: typeof _Vue, options: any = {}) {
    if (this.installed) return
    this.installed = true
    const defaultOption = merge(
      {
        parsedQs: this.parsedQs,
        errorProperty: 'errors',
      },
      options,
    )
    const { axios, errorProperty, parsedQs } = defaultOption
    BaseProxy.$http = axios
    BaseProxy.$errorProperty = errorProperty || 'errors'
    BaseProxy.$parsedQs = parsedQs || this.parsedQs
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
export {
  Validator,
  BaseProxy,
  BaseTransformer,
  PaginationTransformer,
  BaseProxy as BaseService,
}
export * from './util'
export default new VueApiQueries()
