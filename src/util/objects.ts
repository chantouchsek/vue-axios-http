export function isArray(object: any): boolean {
  return Object.prototype.toString.call(object) === '[object Array]'
}

export function hasOwnProperty(obj: any, key: any) {
  if (!obj || !key) return false
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function isFile(object: any): boolean {
  if (typeof window === 'undefined' || typeof File !== 'function' || typeof FileList !== 'function') {
    return false
  }
  return object instanceof File || object instanceof FileList
}

export function is(errors: any, error: any): boolean {
  return isArray(error) ? error.some((w: string) => is(errors, w)) : errors.includes(error)
}
