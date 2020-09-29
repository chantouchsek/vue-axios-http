import { is, isArray } from '../util/objects'

export default class Validator {
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
    let hasError = this.errors.hasOwnProperty(field)
    if (!hasError) {
      const errors = Object.keys(this.errors).filter(
        (e) => e.startsWith(`${field}.`) || e.startsWith(`${field}[`),
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

  nullState(field = null) {
    return this.has(field) ? !this.has(field) : null
  }

  any(): boolean {
    return Object.keys(this.errors).length > 0
  }

  get(field: string): string | string[] {
    return this.errors[field] || []
  }

  all(): string | string[] {
    return this.errors
  }

  fill(errors = {}) {
    this.errors = errors
  }

  flush() {
    this.errors = {}
  }

  clear(attribute: any | any[]) {
    if (!attribute) {
      return this.flush()
    }
    const errors = Object.assign({}, this.errors)
    if (isArray(attribute)) {
      attribute.map((field: string) => {
        Object.keys(errors)
          .filter(
            (e) =>
              e === field ||
              e.startsWith(`${field}.`) ||
              e.startsWith(`${field}[`),
          )
          .forEach((e) => delete errors[e])
      })
    } else {
      Object.keys(errors)
        .filter(
          (e) =>
            e === attribute ||
            e.startsWith(`${attribute}.`) ||
            e.startsWith(`${attribute}[`),
        )
        .forEach((e) => delete errors[e])
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
