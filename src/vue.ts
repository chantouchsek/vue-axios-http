import _Vue from 'vue'
import type { ValidatorType } from './core/Validator'

declare module '@nuxt/types' {
  interface Context {
    $errors: ValidatorType
  }
  interface NuxtAppOptions {
    $errors: ValidatorType
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $errors: ValidatorType
  }
}
declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends _Vue> {
    errors?: ValidatorType
  }
}
