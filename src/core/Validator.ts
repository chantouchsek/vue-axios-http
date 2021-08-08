import { is, isArray } from '../util/objects'

class Validator {
  public errors: any
  public successful: boolean
  public processing: boolean

  constructor() {
    this.processing = false
    this.successful = false
    this.errors = {}
  }

  add(attribute: string, message: string) {
    if (this.missed(attribute)) {
      this.errors[attribute] = []
    }
    if (!this.errors[attribute].includes(message)) {
      this.errors[attribute].push(message)
    }
  }

  has(field: any | any[]) {
    if (isArray(field)) {
      return is(Object.keys(this.errors), field)
    }
    let hasError: boolean = this.errors.hasOwnProperty(field)
    if (!hasError) {
      const errors = Object.keys(this.errors).filter(
        (e: string) => e.startsWith(`${field}.`) || e.startsWith(`${field}[`),
      )
      hasError = errors.length > 0
    }
    return hasError
  }

  first(field: any | any[]): string {
    if (field instanceof Array) {
      for (let i = 0; i < field.length; i++) {
        if (!this.errors.hasOwnProperty(field[i])) {
          continue
        }
        return this.first(field[i])
      }
    }
    return this.get(field)[0]
  }

  missed(field?: string | string[]): boolean {
    return !this.has(field)
  }

  nullState(field?: string | string[]): boolean | null {
    return this.has(field) ? this.missed(field) : null
  }

  any(fields: string[] = [], returnObject?: boolean): boolean | string[] | any {
    if (returnObject) {
      const errors: any = {}
      if (!fields.length) {
        return {}
      }
      fields.forEach((key: string) => (errors[key] = this.get(key)))
      return errors
    }
    if (!fields.length) {
      return Object.keys(this.errors).length > 0
    }
    const errors: any = {}
    fields.forEach((key: string) => (errors[key] = this.get(key)))
    return Object.keys(errors).length > 0
  }

  get(field: string): string | string[] {
    return this.errors[field] || []
  }

  all() {
    return this.errors
  }

  count() {
    return Object.keys(this.errors).length
  }

  fill(errors: any) {
    for (const error in errors) {
      if (!errors.hasOwnProperty(error)) {
        continue
      }
      if (!(errors[error] instanceof Array)) {
        errors[error] = [errors[error]]
      }
    }
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
    const name2 = prefix ? `${prefix}.${name}` : null
    this.clear([name, name2])
  }
}

export type { Validator as ValidatorType }

export default new Validator()
