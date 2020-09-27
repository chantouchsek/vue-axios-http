import type { AxiosInstance } from 'axios'
import { isFile } from '../util/objects'

class BaseProxy {
  public $http!: AxiosInstance
  private parameters: any
  private readonly endpoint: string

  constructor(endpoint: string, parameters?: any | any[]) {
    this.endpoint = endpoint
    this.parameters = parameters
  }

  get http(): AxiosInstance {
    return <AxiosInstance>this.$http
  }

  set http(axios: AxiosInstance) {
    this.$http = axios
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

    return new Promise((resolve, reject) => {
      this.http[requestType](this.__getParameterString(url), form)
        .then((response: any) => {
          const { data } = response
          resolve(data)
        })
        .catch(({ response }: any) => {
          if (response) {
            const { data } = response
            reject(data)
          } else {
            reject()
          }
        })
    })
  }

  __getParameterString(url: string) {
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

  __hasFiles(form: any) {
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

  setParameters(parameters: any[]): this {
    Object.keys(parameters).forEach((key) => {
      this.parameters[key] = parameters[key]
    })
    return this
  }

  setParameter(parameter: any, value: any): this {
    this.parameters[parameter] = value
    return this
  }

  removeParameters(parameters: any[]): this {
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
}

export default BaseProxy
