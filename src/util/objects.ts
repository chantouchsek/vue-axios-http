import { isMatch } from './matcher'

export function isArray(object: any): boolean {
  return Object.prototype.toString.call(object) === '[object Array]'
}

export function isFile(object: any): boolean {
  if (typeof File !== 'function' || typeof FileList !== 'function') {
    return false
  }
  return object instanceof File || object instanceof FileList
}

export function merge(a: string | any, b: string | any): void {
  for (const key in b) {
    if (!b.hasOwnProperty(key)) {
      continue
    }
    a[key] = cloneDeep(b[key])
  }
}

export function cloneDeep(object: any): any {
  if (object === null) {
    return null
  }

  if (isFile(object)) {
    return object
  }

  if (isArray(object)) {
    const clone: string[] = []

    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        clone[key] = cloneDeep(object[key])
      }
    }

    return clone
  }

  if (typeof object === 'object') {
    const clone = {}

    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        clone[key] = cloneDeep(object[key])
      }
    }

    return clone
  }

  return object
}

export function is(errors: any, error: any): boolean {
  if (typeof error === 'string' && error.match(/[\*\!]/)) {
    return errors.filter((w: any) => isMatch(w, error)).length > 0
  }
  return isArray(error)
    ? error.some((w) => is(errors, w))
    : errors.includes(error)
}
