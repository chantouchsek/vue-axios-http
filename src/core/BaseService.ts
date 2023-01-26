import type { ValidatorType } from './Validator'
import type { AxiosError, AxiosInstance, Method, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { IParseOptions } from 'qs'
import { isObject, isArray } from 'lodash'
import qs from 'qs'
import Validator from './Validator'
import { hasFiles, objectToFormData, removeDoubleSlash } from '../util'

const validator = Validator
const UNPROCESSABLE_ENTITY = 422

interface AxiosResponseData {
  [key: string | number]: any
}

class BaseService {
  errors: ValidatorType
  parameters: Record<string, any>
  endpoint: string
  static $http: AxiosInstance
  static $errorProperty = 'errors'
  static $parsedQs: IParseOptions = {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  }

  constructor(endpoint: string, parameters: Record<string, any>) {
    this.endpoint = endpoint
    this.parameters = parameters
    this.errors = Validator
  }

  get $http() {
    return BaseService.$http
  }

  get $errorProperty() {
    return BaseService.$errorProperty
  }

  get $parsedQs() {
    return BaseService.$parsedQs
  }

  all<T = any>() {
    return this.submit<T>('get')
  }

  find<T = any>(id: number | string) {
    return this.submit<T>('get', id)
  }

  post<T = any>(payload: any, config?: AxiosRequestConfig) {
    return this.submit<T>('post', '', payload, config)
  }

  store<T = any>(payload: any, config?: AxiosRequestConfig) {
    return this.post<T>(payload, config)
  }

  put<T = any>(id: any, payload?: any, config?: AxiosRequestConfig) {
    const parameter = id && !isObject(id) ? `/${id}` : ''
    const body = isObject(id) ? id : payload
    const requestType: Method = hasFiles(body) ? 'post' : 'put'
    if (hasFiles(body)) {
      Object.assign(body, { _method: 'put' })
    }
    return this.submit<T>(requestType, parameter, body, config)
  }

  patch<T = any>(id: any, payload?: any, config?: AxiosRequestConfig) {
    const parameter = id && !isObject(id) ? `/${id}` : ''
    const body = isObject(id) ? id : payload
    return this.submit<T>('patch', parameter, body, config)
  }

  update<T = any>(id: string | number, payload: any) {
    return this.patch<T>(id, payload)
  }

  delete<T = any>(id: string | number) {
    return this.submit<T>('delete', `/${id}`)
  }

  remove<T = any>(id: string | number) {
    return this.delete<T>(id)
  }

  submit<T = any>(method: Method, url?: string | number, form?: any, config?: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      this.$submit<T>(method, url, form, config)
        .then(({ data }) => resolve(data))
        .catch((err) => reject(err))
    })
  }

  $submit<T = any>(method: Method, param?: string | number, form?: any, config?: AxiosRequestConfig) {
    BaseService.__validateRequestType(method)
    this.beforeSubmit()
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      const data = hasFiles(form) ? objectToFormData(form) : form
      const endpoint = param ? `/${this.endpoint}/${param}` : `/${this.endpoint}`
      const url = this.__getParameterString(removeDoubleSlash(endpoint))
      config = Object.assign({}, config, { url, data, method })
      this.$http(config)
        .then((response) => {
          this.onSuccess()
          resolve(response)
        })
        .catch((error: AxiosError<AxiosResponseData>) => {
          this.errors.processing = false
          validator.processing = false
          const { response } = error
          if (response && response.status === UNPROCESSABLE_ENTITY) {
            const { data } = response
            const errors: Record<string, any> = {}
            Object.assign(errors, data[this.$errorProperty])
            this.onFail(errors)
          }
          reject(error)
        })
    })
  }

  private __getParameterString(url: string) {
    const query = qs.stringify(this.parameters, {
      encode: false,
      skipNulls: true,
      addQueryPrefix: true,
    })
    return `${url}${query}`
  }

  private static __validateRequestType(requestType: Method) {
    const requestTypes: Method[] = [
      'get',
      'GET',
      'delete',
      'DELETE',
      'head',
      'HEAD',
      'options',
      'OPTIONS',
      'post',
      'POST',
      'put',
      'PUT',
      'patch',
      'PATCH',
    ]
    if (!requestTypes.includes(requestType)) {
      throw new Error(
        `\`${requestType}\` is not a valid request type, ` + `must be one of: \`${requestTypes.join('`, `')}\`.`,
      )
    }
    return requestType
  }

  setParameters(parameters: Record<string, any>): this {
    Object.keys(parameters).forEach((key) => {
      this.parameters[key] = parameters[key]
    })
    return this
  }

  setParameter(parameter: string, value?: any): this {
    if (!value) {
      const options: IParseOptions = Object.assign({}, this.$parsedQs, {
        comma: true,
        allowDots: true,
        ignoreQueryPrefix: true,
      })
      const params = qs.parse(parameter, options)
      return this.setParameters(params)
    }
    this.parameters[parameter] = value
    return this
  }

  removeParameters(parameters = [] as any[]): this {
    if (!parameters || !parameters.length) {
      this.parameters = []
    } else if (isArray(parameters)) {
      for (const parameter of parameters) {
        delete this.parameters[parameter]
      }
    }
    return this
  }

  removeParameter(parameter: string): this {
    delete this.parameters[parameter]
    return this
  }

  onFail(errors: Record<string, any>) {
    this.errors.fill(errors)
    validator.fill(errors)
  }

  beforeSubmit() {
    if (!this.$http) {
      throw new Error('Vue Axios Http, No http library provided.')
    }
    this.errors.flush()
    this.errors.processing = true
    this.errors.successful = false
    validator.flush()
    validator.processing = true
    validator.successful = false
  }

  onSuccess() {
    this.errors.processing = false
    this.errors.successful = true
    validator.processing = false
    validator.successful = true
  }
}

export default BaseService
