import type { SimpleObject } from '../types'
import { castArray, cloneDeep, get, has, omit, replace } from 'lodash'
import { is, toCamelCase, toSnakeCase } from '../util'

class Validator {
  constructor(
    public errors: SimpleObject<any> = {},
    public processing = false,
    public successful = false,
  ) {}

  add(field: string, message: string, forceUpdate?: boolean) {
    if (forceUpdate || this.missed(field)) {
      this.errors[field] = [message]
    } else if (!this.errors[field].includes(message)) {
      this.errors[field].unshift(message)
    }
  }

  has(field: string | string[]) {
    const fields = this.fields(field)
    return is(Object.keys(this.errors), fields)
  }

  first(field: string | string[]) {
    const fields = this.fields(castArray(field))
    const foundField = fields.find((f) => has(this.errors, f)) || ''
    const value = this.get(foundField)
    return Array.isArray(value) ? value[0] : value
  }

  firstBy(obj: SimpleObject<any>, field: string = Object.keys(obj)[0]): string {
    return castArray(obj[field])[0]
  }

  missed(field: string | string[]) {
    return !this.has(field)
  }

  nullState(field: string | string[]) {
    return this.has(field) ? this.missed(field) : null
  }

  any(field: string[] = [], returnObject?: boolean) {
    const fields = this.fields(field)
    const errors: SimpleObject<any> = {}

    if (!fields.length) return returnObject ? {} : Object.keys(this.errors).length > 0

    fields.forEach((f: string) => {
      const val = this.get(f)
      if (returnObject && val.length) errors[f] = val
      else if (!returnObject) errors[f] = val
    })

    return returnObject ? errors : Object.keys(errors).length > 0
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

  fill(errors: SimpleObject<any>) {
    this.errors = errors
  }

  flush() {
    this.fill({})
  }

  clear(field?: string | string[]) {
    if (!field) return this.flush()
    const errors = omit(cloneDeep(this.errors), this.fields(field))
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

  fields(field: string | string[]) {
    const processField = (f: string) => {
      if (f.includes('*')) {
        const regex = new RegExp(`^${replace(f, '*', '.*')}$`, 'i')
        for (const key in this.errors) {
          if (regex.test(key)) fields.push(toCamelCase(key), toSnakeCase(key))
        }
      } else fields.push(toCamelCase(f), toSnakeCase(f))
    }

    const fields: string[] = []
    Array.isArray(field) ? field.forEach(processField) : processField(field)
    return [...new Set(fields)].filter(Boolean)
  }
}

export type { Validator as ValidatorType }

export default new Validator()
