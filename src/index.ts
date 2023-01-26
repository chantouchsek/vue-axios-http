import type { ValidatorType } from './core/Validator'
import type { IParseOptions } from 'qs'
import type _Vue from 'vue'
import { merge } from 'lodash'
import BaseService from './core/BaseService'
import Validator from './core/Validator'

// augment typings of Vue.js
import './vue'

class AxiosHttp {
  installed = false
  parsedQs: IParseOptions = {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  }
  install(Vue: typeof _Vue, options: Record<string, any> = {}) {
    if (this.installed) return
    this.installed = true
    const defaultOption = merge({ parsedQs: this.parsedQs, errorProperty: 'errors' }, options)
    const { $axios, errorProperty, parsedQs } = defaultOption
    BaseService.$http = $axios
    BaseService.$errorProperty = errorProperty || 'errors'
    BaseService.$parsedQs = parsedQs
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
export type { ValidatorType }
export { Validator, BaseService }
export default new AxiosHttp()
