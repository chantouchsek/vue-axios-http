import type { ValidatorType } from './core/Validator'
import type { IParseOptions } from 'qs'
import type _Vue from 'vue'
import { merge } from 'lodash'
import BaseService from './core/BaseService'
import Validator from './core/Validator'

// augment typings of Vue.js
import './vue'

interface ModuleOptions {
  removeParams?: boolean
  parsedQs: IParseOptions
  errorProperty?: string | 'errors' | 'message'
}
const optionDefault: ModuleOptions = {
  removeParams: false,
  parsedQs: {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  },
  errorProperty: 'errors',
}

class AxiosHttp {
  installed = false
  install(Vue: typeof _Vue, options: Partial<ModuleOptions> = {}) {
    if (this.installed) return

    this.installed = true
    const { errorProperty, parsedQs, removeParams } = merge(optionDefault, options)

    BaseService.$parsedQs = parsedQs
    BaseService.$removeParams = removeParams
    BaseService.$errorProperty = errorProperty || 'errors'
    Vue.mixin({
      beforeCreate() {
        this.$options.$errors = {} as never
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Vue.util.defineReactive(this.$options, '$errors', Validator)
        if (!this.$options.computed) this.$options.computed = {}
        this.$options.computed.$errors = function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return this.$options.$errors
        }
      },
    })
  }
}

export * from './util'
export type { ValidatorType, ModuleOptions }
export { Validator, BaseService }
export default new AxiosHttp()
