import type { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios'
import { isFile, isArray } from '../util/objects'
import type { Errors } from '../'
import Validator from './Validator'
import { objectToFormData } from '../util/formData'

const validator = Validator
const UNPROCESSABLE_ENTITY = 422
export interface ParametersType {
  [key: string]: any
}

class BaseProxy {
  public errors: Errors
  public parameters: any | any[]
  public readonly endpoint: string
  public static $http: AxiosInstance
  public static $errorsKeyName = 'errors'

  constructor(endpoint: string, parameters?: any | any[]) {
    this.endpoint = endpoint
    this.parameters = parameters
    this.errors = Validator
  }

  get $http(): AxiosInstance {
    return <AxiosInstance>BaseProxy.$http
  }

  get $errorsKeyName(): string {
    return BaseProxy.$errorsKeyName
  }

  all(): Promise<any> {
    return this.submit('get', `/${this.endpoint}`)
  }

  find(id: number | string): Promise<any> {
    return this.submit('get', `/${this.endpoint}/${id}`)
  }

  post(payload: any): Promise<any> {
    return this.submit('post', `/${this.endpoint}`, payload)
  }

  store(payload: any): Promise<any> {
    return this.post(payload)
  }

  put(id: string | number, payload: any): Promise<any> {
    return this.submit('put', `/${this.endpoint}/${id}`, payload)
  }

  putWithFile(id: string | number, payload: any): Promise<any> {
    payload['_method'] = 'put'
    return this.submit('post', `/${this.endpoint}/${id}`, payload)
  }

  patch(id: string | number, payload: any): Promise<any> {
    return this.submit('patch', `/${this.endpoint}/${id}`, payload)
  }

  delete(id: string | number): Promise<any> {
    return this.submit('delete', `/${this.endpoint}/${id}`)
  }

  submit(requestType: Method, url: string, form?: any): Promise<any> {
    this.__validateRequestType(requestType)
    this.beforeSubmit()
    return new Promise((resolve, reject) => {
      const data = this.__hasFiles(form) ? objectToFormData(form) : form
      this.$http[requestType](this.__getParameterString(url), data)
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
              Object.assign(errors, data[this.$errorsKeyName])
              this.onFail(errors)
              validator.fill(errors)
            }
            reject(error)
          } else {
            reject()
          }
        })
    })
  }

  __getParameterString(url: string): string {
    const keys = Object.keys(this.parameters)
    const parameters = keys
      .filter((key: string) => !!this.parameters[key])
      .map((key: string) => `${key}=${this.parameters[key]}`)
    return parameters.length === 0 ? url : `${url}?${parameters.join('&')}`
  }

  __getQueryString(parameter: string): string[] {
    const queries: string[] = parameter.split('&')
    const obj: any = {}
    queries.forEach(function (property: string) {
      const [key = null, value = null]: string[] = property.split('=')
      obj[key] = value
    })
    return obj
  }

  __validateRequestType(requestType: Method): void {
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
  }

  __hasFiles(form: any): boolean {
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

  __hasFilesDeep(object: any): boolean {
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

  setParameters(parameters: ParametersType): this {
    Object.keys(parameters).forEach((key) => {
      this.parameters[key] = parameters[key]
    })
    return this
  }

  setParameter(parameter: string, value?: any): this {
    if (!value) {
      this.parameters = this.__getQueryString(parameter)
      return this
    }
    this.parameters[parameter] = value
    return this
  }

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

  removeParameter(parameter: any): this {
    delete this.parameters[parameter]
    return this
  }

  onFail(errors: ParametersType): void {
    this.errors.fill(errors)
  }

  beforeSubmit(): void {
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

  onSuccess(): void {
    this.errors.processing = false
    this.errors.successful = true
    validator.processing = false
    validator.successful = true
  }
}

export default BaseProxy
