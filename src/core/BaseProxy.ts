import type { AxiosInstance } from 'axios'
import { isFile } from '../util/objects'
import type { Errors } from '../'
import Validator from './Validator'
import { objectToFormData } from '../util/formData'

class BaseProxy {
  private parameters: any
  private readonly endpoint: string
  public static $http: AxiosInstance
  public errors: Errors

  constructor(endpoint: string, parameters?: any | any[]) {
    this.endpoint = endpoint
    this.parameters = parameters
    this.errors = Validator
  }

  get $http(): AxiosInstance {
    return <AxiosInstance>BaseProxy.$http
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

  put(id: string | number, payload: any) {
    return this.submit('put', `/${this.endpoint}/${id}`, payload)
  }

  patch(id: string | number, payload: any) {
    return this.submit('patch', `/${this.endpoint}/${id}`, payload)
  }

  delete(id: string | number) {
    return this.submit('delete', `/${this.endpoint}/${id}`)
  }

  submit(requestType: string, url: string, form?: any): Promise<any> {
    this.__validateRequestType(requestType)
    const validator = Validator
    this.errors.flush()
    this.errors.processing = true
    this.errors.successful = false

    return new Promise((resolve, reject) => {
      const data = this.__hasFiles(form) ? objectToFormData(form) : form
      this.$http[requestType](this.__getParameterString(url), data)
        .then((response: ParametersType) => {
          this.errors.processing = false
          this.errors.successful = true
          validator.processing = false
          validator.successful = true
          const { data = {} } = response
          resolve(data)
        })
        .catch((error) => {
          this.errors.processing = false
          validator.processing = false
          const { response } = error
          if (response) {
            const { data = {}, status } = response
            if (parseInt(status) === 422) {
              this.onFail(data)
              validator.fill(data.errors)
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
      .filter((key) => !!this.parameters[key])
      .map((key) => `${key}=${this.parameters[key]}`)
    return parameters.length === 0 ? url : `${url}?${parameters.join('&')}`
  }

  __validateRequestType(requestType: string): void {
    const requestTypes = ['get', 'delete', 'head', 'post', 'put', 'patch']
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

    if (Array.isArray(object)) {
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

  setParameter(parameter: any, value: any): this {
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

  removeParameter(parameter: any) {
    delete this.parameters[parameter]
    return this
  }

  onFail(data: ParametersType): void {
    if (data && data.errors) {
      this.errors.fill(data.errors)
    }
  }
}

export default BaseProxy

export interface ParametersType {
  [key: string]: any
}
