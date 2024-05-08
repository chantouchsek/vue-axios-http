import type { SimpleObject } from '../types'
import type { AxiosError, AxiosInstance, Method, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { IParseOptions } from 'qs'
import { isObject } from 'lodash'
import { parse, stringify } from 'qs'
import Validator from './Validator'
import { hasFiles, objectToFormData } from '../util'

const validator = Validator
const UNPROCESSABLE_ENTITY = 422

interface AxiosResponseData {
  [key: string | number]: any
}

export default class BaseService {
  public errors = Validator
  static $http: AxiosInstance
  static $errorProperty = 'errors'
  static $resetParameter? = false
  static $parsedQs: IParseOptions = {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  }

  constructor(
    readonly endpoint: string,
    public parameters: SimpleObject<any> = {},
  ) {}

  get $http() {
    return BaseService.$http
  }

  get $errorProperty() {
    return BaseService.$errorProperty
  }

  get $resetParameter() {
    return BaseService.$resetParameter
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
    if (hasFiles(body)) Object.assign(body, { _method: 'put' })
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

  $submit<T = any, F = any>(method: Method, param?: string | number, form?: F, config?: AxiosRequestConfig) {
    this.beforeSubmit()
    const formData = hasFiles(form) ? objectToFormData(form) : form
    const endpointPath = param ? `/${this.endpoint}/${param}` : `/${this.endpoint}`
    const endpoint = endpointPath.replace(/\/\//g, '/')
    const url = this.__getParameterString(endpoint)
    const axiosConfig = { url, data: formData, method, ...config }
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      this.$http<T>(axiosConfig)
        .then((response) => {
          this.onSuccess()
          if (this.$resetParameter) this.removeParameters()
          resolve(response as AxiosResponse<T>)
        })
        .catch((error: AxiosError<AxiosResponseData>) => {
          this.errors.processing = false
          validator.processing = false
          if (error.response && error.response.status === UNPROCESSABLE_ENTITY) {
            const validationErrors: SimpleObject<any> = {}
            Object.assign(validationErrors, error.response.data[this.$errorProperty])
            this.onFail(validationErrors)
          }
          reject(error)
        })
    })
  }

  async submit<T = any, F = any>(method: Method, url?: string | number, form?: F, config?: AxiosRequestConfig) {
    const { data } = await this.$submit<T>(method, url, form, config)
    return data
  }

  private __getParameterString(url: string) {
    const query = stringify(this.parameters, {
      encode: true,
      skipNulls: true,
      addQueryPrefix: true,
      encodeValuesOnly: true,
      strictNullHandling: true,
    })
    return `${url}${query}`
  }

  setParameters(parameters: SimpleObject<any>) {
    this.parameters = { ...this.parameters, ...parameters }
    return this
  }

  setParameter(parameter: string, value?: any) {
    if (!value) {
      return this.setParameters(
        parse(parameter, {
          ...this.$parsedQs,
          comma: true,
          allowDots: true,
          ignoreQueryPrefix: true,
        }),
      )
    }
    this.parameters[parameter] = value
    return this
  }

  removeParameters(parameters: string[] = []) {
    parameters.length ? parameters.forEach((param) => delete this.parameters[param]) : (this.parameters = {})
    return this
  }

  removeParameter(parameter: string) {
    delete this.parameters[parameter]
    return this
  }

  onFail(errors: SimpleObject<any>) {
    this.errors.fill(errors)
    validator.fill(errors)
  }

  beforeSubmit() {
    if (!this.$http) throw new Error('Vue Axios Http, No http library provided.')
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
