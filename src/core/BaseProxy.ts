import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  Method,
  AxiosRequestConfig,
} from 'axios'
import { isArray, isFile } from '../util/objects'
import type { Errors } from '..'
import Validator from './Validator'
import { objectToFormData } from '../util/formData'
import qs, { ParsedQs } from 'qs'
import { removeDoubleSlash } from '../util/string'

const validator = Validator
const UNPROCESSABLE_ENTITY = 422

export interface ParametersType {
  [key: string]: any
}

class BaseProxy {
  public errors: Errors
  public parameters: any | any[]
  public readonly endpoint: string
  public static $http: AxiosInstance | undefined
  public static $errorProperty = 'errors'

  constructor(endpoint: string, parameters?: ParametersType) {
    this.endpoint = endpoint
    this.parameters = parameters
    this.errors = Validator
  }

  get $http(): AxiosInstance {
    return <AxiosInstance>BaseProxy.$http
  }

  get $errorProperty() {
    return BaseProxy.$errorProperty
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
  getOne<T>(id: string | number) {
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
   * Update record by id using PUT method
   * @param {string|number} id
   * @param {Object|string} payload
   */
  put<T>(id: string | number, payload: any) {
    return this.submit<T>('put', `/${id}`, payload)
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
  submit<T>(
    requestType: Method,
    parameter?: string | number,
    form?: T,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const method = BaseProxy.__validateRequestType(requestType)
    this.beforeSubmit()
    return new Promise((resolve, reject) => {
      const data = this.__hasFiles(form) ? objectToFormData(form) : form
      const url = parameter
        ? `/${this.endpoint}/${parameter}`
        : `/${this.endpoint}`
      const endpoint = this.__getParameterString(removeDoubleSlash(url))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$http[method](endpoint, data, config)
        .then((response: AxiosResponse) => {
          this.onSuccess()
          const { data } = response
          resolve(data)
        })
        .catch((error: AxiosError) => {
          this.errors.processing = false
          validator.processing = false
          const { response } = error
          if (response) {
            const { data, status } = response
            if (status === UNPROCESSABLE_ENTITY) {
              const errors = {}
              Object.assign(errors, data[this.$errorProperty])
              this.onFail(errors)
            }
            reject(error)
          } else {
            reject(error)
          }
        })
    })
  }

  private __getParameterString(url: string): string {
    const query = qs.stringify(this.parameters, {
      encode: false,
      skipNulls: true,
      addQueryPrefix: true,
    })
    return `${url}${query}`
  }

  private static __validateRequestType(requestType: Method): string {
    const requestTypes: Array<string> = [
      'get',
      'delete',
      'head',
      'post',
      'put',
      'patch',
    ]
    if (!requestTypes.includes(requestType)) {
      throw new Error(
        `\`${requestType}\` is not a valid request type, ` +
          `must be one of: \`${requestTypes.join('`, `')}\`.`,
      )
    }
    return requestType.toLowerCase()
  }

  private __hasFiles(form: any): boolean {
    for (const property in form) {
      if (!form.hasOwnProperty(property)) {
        return false
      }
      if (typeof window === 'undefined') {
        return false
      }
      if (this.__hasFilesDeep(form[property])) {
        return true
      }
    }
    return false
  }

  private __hasFilesDeep(object: any): boolean {
    if (object === null) {
      return false
    }
    if (typeof object === 'object') {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          if (isFile(object[key])) {
            return true
          }
        }
      }
    }
    if (isArray(object)) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          return this.__hasFilesDeep(object[key])
        }
      }
    }
    return isFile(object)
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
      const options = {
        comma: true,
        allowDots: true,
        ignoreQueryPrefix: true,
      }
      const params: ParsedQs = qs.parse(parameter, options)
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
      parameters.forEach((parameter) => {
        delete this.parameters[parameter]
      })
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
      throw new Error('Vue Api Queries, No http library provided.')
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
