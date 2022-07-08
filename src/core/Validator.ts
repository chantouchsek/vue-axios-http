import { is } from '../util'
import get from 'lodash.get'
import has from 'lodash.has'

class Validator {
  public errors: Record<string, any>
  public successful: boolean
  public processing: boolean

  constructor(errors: Record<string, any> = {}) {
    this.processing = false
    this.successful = false
    this.errors = errors
  }

  add(attribute: string, message: string) {
    if (this.missed(attribute)) {
      this.errors[attribute] = []
    }
    if (!this.errors[attribute].includes(message)) {
      this.errors[attribute].push(message)
    }
  }

  has(field: string | string[]) {
    if (Array.isArray(field)) {
      return is(Object.keys(this.errors), field)
    }
    let hasError = has(this.errors, field)
    if (!hasError) {
      const errors = Object.keys(this.errors).filter(
        (e: string) => e.startsWith(`${field}.`) || e.startsWith(`${field}[`),
      )
      hasError = errors.length > 0
    }
    return hasError
  }

  first(field: string | string[]): string | object {
    if (Array.isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        if (!has(this.errors, field[i])) {
          continue
        }
        return this.first(field[i])
      }
    }
    const value = this.get(field as string)
    if (Array.isArray(value)) return value[0]
    return value // return it if object like
  }

  firstBy(obj: Record<string, any>, field?: string): string {
    let value
    if (!field) {
      value = obj[Object.keys(obj)[0]]
    } else {
      value = obj[field]
    }
    if (Array.isArray(value)) value = value[0]
    return value
  }

  missed(field: string | string[]): boolean {
    return !this.has(field)
  }

  nullState(field: string | string[]): boolean | null {
    return this.has(field) ? this.missed(field) : null
  }

  any(fields: string[] = [], returnObject?: boolean): boolean | string[] | any {
    if (returnObject) {
      const errors: Record<string, any> = {}
      if (!fields.length) {
        return {}
      }
      fields.forEach((key: string) => (errors[key] = this.get(key)))
      return errors
    }
    if (!fields.length) {
      return Object.keys(this.errors).length > 0
    }
    const errors: Record<string, any> = {}
    fields.forEach((key: string) => (errors[key] = this.get(key)))
    return Object.keys(errors).length > 0
  }

  get(field: string): string | string[] {
    return get(this.errors, field) || []
  }

  all() {
    return this.errors
  }

  count() {
    return Object.keys(this.errors).length
  }

  fill(errors: Record<string, any>) {
    this.errors = errors
  }

  flush() {
    this.errors = {}
  }

  clear(attribute?: string | string[]) {
    if (!attribute) {
      return this.flush()
    }
    const errors = Object.assign({}, this.errors)
    if (attribute instanceof Array) {
      attribute.map((field: string) => {
        Object.keys(errors)
          .filter(
            (e: string) =>
              e === field ||
              e.startsWith(`${field}.`) ||
              e.startsWith(`${field}[`),
          )
          .forEach((e: string) => delete errors[e])
      })
    } else {
      Object.keys(errors)
        .filter(
          (e: string) =>
            e === attribute ||
            e.startsWith(`${attribute}.`) ||
            e.startsWith(`${attribute}[`),
        )
        .forEach((e: string) => delete errors[e])
    }
    this.fill(errors)
  }

  isValid() {
    return !this.any()
  }

  onKeydown(event: any, prefix?: string) {
    const { name } = event.target
    if (!name) return
    const nameWithPrefix = prefix ? `${prefix}.${name}` : null
    this.clear([name, nameWithPrefix])
  }
}

export type { Validator as ValidatorType }

export default new Validator()
