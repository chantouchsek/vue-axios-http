import type { ValidatorType } from './core/Validator'
import Validator from './core/Validator'

export type Errors = ValidatorType

class VueApiQuery {
  install(Vue: any) {
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
export { default as Validator } from './core/Validator'
export { default as BaseProxy } from './core/BaseProxy'
export default new VueApiQuery()

declare module '@nuxt/types' {
  interface Context {
    $errors: Errors
  }
  interface NuxtAppOptions {
    $errors: Errors
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $errors: Errors
  }
}
