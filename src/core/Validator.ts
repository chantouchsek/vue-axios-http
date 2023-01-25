import { cloneDeep, get, has, omit } from 'lodash'
import { is, toCamelCase, toSnakeCase } from '../util'

class Validator {
  public errors: Record<string, any>
  public successful: boolean
  public processing: boolean

  constructor(errors: Record<string, any> = {}) {
    this.processing = false
    this.successful = false
    this.errors = errors
  }

  add(field: string, message: string, forceUpdate?: boolean) {
    if (this.missed(field)) {
      this.errors[field] = []
    }
    if (!this.errors[field].includes(message)) {
      this.errors[field].unshift(message)
    }
    if (forceUpdate) {
      this.errors[field] = []
      this.errors[field].push(message)
    }
  }

  has(field: string | string[]) {
    const fields = this.fields(field)
    return is(Object.keys(this.errors), fields)
  }

  first(field: string | string[]): string | Record<string, any> | undefined {
    if (Array.isArray(field)) {
      const fields = this.fields(field)
      for (const f of fields) {
        if (!has(this.errors, f)) continue
        return this.first(f)
      }
    } else {
      const value = this.get(field)
      if (Array.isArray(value)) return value[0]
      return value
    }
  }

  firstBy(obj: Record<string, any>, field?: string) {
    let value: string
    if (!field) {
      value = obj[Object.keys(obj)[0]]
    } else {
      value = obj[field]
    }
    if (Array.isArray(value)) value = value[0]
    return value
  }

  missed(field: string | string[]) {
    return !this.has(field)
  }

  nullState(field: string | string[]) {
    return this.has(field) ? this.missed(field) : null
  }

  any(fields: string[] = [], returnObject?: boolean) {
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
    return get(this.errors, field, [])
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
    this.fill({})
  }

  clear(field?: string | string[]) {
    if (!field) return this.flush()
    const errors = omit(cloneDeep(this.errors), field)
    this.fill(errors)
  }

  isValid() {
    return !this.any()
  }

  onKeydown(event: any, prefix?: string) {
    const { name } = event.target as HTMLInputElement
    if (!name) return
    const names = prefix ? [name, `${prefix}.${name}`] : [name]
    this.clear(names)
  }

  fields(field: string | string[]): string[] {
    const fields = []
    if (Array.isArray(field)) {
      for (const f of field) {
        fields.push(toCamelCase(f), toSnakeCase(f))
      }
    } else {
      fields.push(toCamelCase(field), toSnakeCase(field))
    }
    return [...new Set(fields)].filter(Boolean)
  }
}

export type { Validator as ValidatorType }

export default new Validator()
