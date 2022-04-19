import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  Method,
  AxiosRequestConfig,
} from 'axios'
import type { Errors } from '..'
import Validator from './Validator'
import { hasFiles, objectToFormData, removeDoubleSlash } from '../util'
import qs, { IParseOptions } from 'qs'

const validator = Validator
const UNPROCESSABLE_ENTITY = 422

export interface ParametersType {
  [key: string]: any
}

class BaseProxy {
  errors: Errors
  parameters: any | any[]
  endpoint: string
  static $http: AxiosInstance
  static $errorProperty = 'errors'
  static $parsedQs: IParseOptions = {
    comma: true,
    allowDots: true,
    ignoreQueryPrefix: true,
  }

  constructor(endpoint: string, parameters?: ParametersType) {
    this.endpoint = endpoint
    this.parameters = parameters
    this.errors = Validator
  }

  get $http() {
    return BaseProxy.$http
  }

  get $errorProperty() {
    return BaseProxy.$errorProperty
  }

  get $parsedQs() {
    return BaseProxy.$parsedQs
  }

  /**
   * Get all or by pagination
   */
  all<T>() {
    return this.submit<T>('get')
  }

  /**
   * Alternative of all method
   */
  getMany<T>() {
    return this.all<T>()
  }

  /**
   * Find a record by id
   * @param {string|number} id
   */
  find<T>(id: number | string) {
    return this.submit<T>('get', id)
  }

  /**
   * Alternative of find method
   * @param {string | number} id
   */
  getOne<T>(id: number | string) {
    return this.find<T>(id)
  }

  /**
   * Create record
   * @param {Object|string} payload
   * @param {AxiosRequestConfig} config
   */
  post<T>(payload: any, config?: AxiosRequestConfig) {
    return this.submit<T>('post', '', payload, config)
  }

  /**
   * Alternative of post method
   * @param payload
   * @param {AxiosRequestConfig} config
   */
  store<T>(payload: any, config?: AxiosRequestConfig) {
    return this.post<T>(payload, config)
  }

  /**
   * Alternative of store method
   * @param payload
   * @param {AxiosRequestConfig} config
   */
  create<T>(payload: any, config?: AxiosRequestConfig) {
    return this.store<T>(payload, config)
  }

  /**
   * Create many items
   * @param {Object} payload
   */
  createMany<T>(payload: T) {
    return this.submit<T>('post', 'bulk', payload)
  }

  /**
   * Update record by id using PUT method
   * @param {string|number} id
   * @param {Object|string} payload
   */
  put<T>(id: string | number, payload: any) {
    return this.submit<T>('put', `/${id}`, payload)
  }

  /**
   * Update record without ID parameter by using PUT method
   * @param {Object|string} payload
   */
  putWithoutId<T>(payload: any) {
    return this.submit<T>('put', '', payload)
  }

  /**
   * Alternative of put method
   * @param {string|number} id
   * @param {Object|string} payload
   */
  replace<T>(id: string | number, payload: any) {
    return this.put<T>(id, payload)
  }

  /**
   * This method helpful for laravel developer
   * @param {string|number} id
   * @param {Object} payload
   * @param config
   */
  putWithFile<T>(
    id: string | number,
    payload: any,
    config?: AxiosRequestConfig,
  ) {
    payload._method = 'put'
    return this.submit<T>('post', `/${id}`, payload, config)
  }

  /**
   * Update record by id
   * @param id
   * @param payload
   */
  patch<T>(id: string | number, payload: any) {
    return this.submit<T>('patch', `/${id}`, payload)
  }

  /**
   * Alternative of path method
   * @param {string|number} id
   * @param {Object|string} payload
   */
  update<T>(id: string | number, payload: any) {
    return this.patch<T>(id, payload)
  }

  /**
   * Delete record by id
   * @param {string|number} id
   */
  delete<T>(id: string | number) {
    return this.submit<T>('delete', `/${id}`)
  }

  /**
   * Alternative of delete method
   * @param {string|number} id
   */
  remove<T>(id: string | number) {
    return this.delete<T>(id)
  }

  /**
   * Main endpoint method to handle requests
   * @param requestType
   * @param {string} parameter
   * @param {Object|string} form
   * @param {AxiosRequestConfig} config
   */
  submit<T = any>(
    requestType: Method,
    parameter?: string | number,
    form?: T,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const method = BaseProxy.__validateRequestType(requestType)
    this.beforeSubmit()
    return new Promise((resolve, reject) => {
      const data = hasFiles(form) ? objectToFormData(form) : form
      const endpoint = parameter
        ? `/${this.endpoint}/${parameter}`
        : `/${this.endpoint}`
      const url = this.__getParameterString(removeDoubleSlash(endpoint))
      config = Object.assign({}, config, { url, data, method })
      this.$http(config)
        .then((response: AxiosResponse) => {
          this.onSuccess()
          resolve(response.data || {})
        })
        .catch((error: AxiosError) => {
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
        `\`${requestType}\` is not a valid request type, ` +
          `must be one of: \`${requestTypes.join('`, `')}\`.`,
      )
    }
    return requestType
  }

  /**
   * Set parameters by keys
   * @param {Object} parameters
   */
  setParameters(parameters: ParametersType): this {
    Object.keys(parameters).forEach((key) => {
      this.parameters[key] = parameters[key]
    })
    return this
  }

  /**
   * Set parameters by key
   * @param {string} parameter
   * @param {Object|string|Array} value
   */
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

  /**
   * Remove parameters by keys
   * @param {Array<Object>>} parameters
   */
  removeParameters(parameters = [] as any[]): this {
    if (!parameters.length) {
      this.parameters = []
    } else {
      for (const parameter of parameters) {
        delete this.parameters[parameter]
      }
    }
    return this
  }

  /**
   * Remove parameters
   * @param {string} parameter
   */
  removeParameter(parameter: string): this {
    delete this.parameters[parameter]
    return this
  }

  /**
   * Fill errors on fails passed
   * @param {Object} errors
   */
  onFail(errors: ParametersType) {
    this.errors.fill(errors)
    validator.fill(errors)
  }

  /**
   * Clean up errors and set processing
   */
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

  /**
   * Clean up errors and set success on after request
   */
  onSuccess() {
    this.errors.processing = false
    this.errors.successful = true
    validator.processing = false
    validator.successful = true
  }
}

export default BaseProxy
