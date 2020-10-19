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

  add(attribute: string, message: string): void {
    if (this.missed(attribute)) {
      this.errors[attribute] = []
    }
    if (!this.errors[attribute].includes(message)) {
      this.errors[attribute].push(message)
    }
  }

  has(field: any | any[]): boolean {
    if (isArray(field)) {
      return is(Object.keys(this.errors), field)
    }
    let hasError = this.errors.hasOwnProperty(field)
    if (!hasError) {
      const errors = Object.keys(this.errors).filter(
        (e: string) => e.startsWith(`${field}.`) || e.startsWith(`${field}[`),
      )
      hasError = errors.length > 0
    }
    return hasError
  }

  first(field: any | any[]): string {
    if (isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        if (!this.errors.hasOwnProperty(field[i])) {
          continue
        }
        return this.first(field[i])
      }
    }
    return this.get(field)[0]
  }

  missed(field = null): boolean {
    return !this.has(field)
  }

  nullState(field = null): boolean | null {
    return this.has(field) ? !this.has(field) : null
  }

  any(fields = [], returnObject?: boolean): boolean | string[] | any {
    if (returnObject) {
      const errors = {}
      if (!fields.length) {
        return {}
      }
      fields.forEach((key: string) => (errors[key] = this.get(key)))
      return errors
    }
    if (!fields.length) {
      return Object.keys(this.errors).length > 0
    }
    const errors = {}
    fields.forEach((key: string) => (errors[key] = this.get(key)))
    return Object.keys(errors).length > 0
  }

  get(field: string): string | string[] {
    return this.errors[field] || []
  }

  all(): string | string[] {
    return this.errors
  }

  fill(errors: ErrorOptions): void {
    this.errors = errors
  }

  flush(): void {
    this.errors = {}
  }

  clear(attribute?: any | any[]): void {
    if (!attribute) {
      return this.flush()
    }
    const errors = Object.assign({}, this.errors)
    if (isArray(attribute)) {
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

  isValid(): boolean {
    return !this.any()
  }

  onKeydown(event: any, prefix?: string): void {
    const { name } = event.target
    if (!name) return
    const name2 = prefix ? `${prefix}.${name}` : null
    this.clear([name, name2])
  }
}

export interface ErrorOptions {
  [key: string]: any | any[]
}

export type { Validator as ValidatorType }

export default new Validator()
