export function isArray(object: any): boolean {
  return Object.prototype.toString.call(object) === '[object Array]'
}

export function hasOwnProperty(obj: any, key: any) {
  if (!obj || !key) return false
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function isFile(object: any): boolean {
  if (
    typeof window === 'undefined' ||
    typeof File !== 'function' ||
    typeof FileList !== 'function'
  ) {
    return false
  }
  return object instanceof File || object instanceof FileList
}

export function merge(a: any, b: any): Record<any, any> {
  for (const key in b) {
    if (hasOwnProperty(b, key)) {
      a[key] = cloneDeep(b[key])
    }
  }
  return a
}

export function cloneDeep(object: any): any {
  if (object === null) {
    return null
  }

  if (isFile(object)) {
    return object
  }

  if (isArray(object)) {
    const clone: any = []

    for (const key in object) {
      if (hasOwnProperty(object, key)) {
        clone[key] = cloneDeep(object[key])
      }
    }

    return clone
  }

  if (typeof object === 'object') {
    const clone: any = {}

    for (const key in object) {
      if (hasOwnProperty(object, key)) {
        clone[key] = cloneDeep(object[key])
      }
    }

    return clone
  }

  return object
}

export function is(errors: any, error: any): boolean {
  return isArray(error)
    ? error.some((w: string) => is(errors, w))
    : errors.includes(error)
}
