import type { ValidatorType } from './core/Validator'
import Validator from './core/Validator'
import _Vue from 'vue'

// augment typings of Vue.js
import './vue'

export type Errors = ValidatorType
export type { ValidatorType }

class VueApiQueries {
  install(Vue: typeof _Vue) {
    Vue.mixin({
      beforeCreate() {
        this.$options['$errors'] = {}
        Vue.set(this.$options, '$errors', Validator)
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
export { default as Validator } from './core/Validator'
export { default as BaseProxy } from './core/BaseProxy'
export { default as BaseTransformer } from './core/BaseTransformer'
export { default as PaginationTransformer } from './core/PaginationTransformer'
export default new VueApiQueries()
