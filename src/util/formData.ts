import { isFile } from './objects'

export function objectToFormData(obj: any, formData = new FormData(), parent = ''): FormData {
  if (obj == null || (Array.isArray(obj) && obj.length === 0)) {
    formData.append(parent, obj)
  } else {
    const propertyMap = new Map(Object.entries(obj))
    for (const [property, value] of propertyMap) {
      const key = parent ? `${parent}[${property}]` : property
      appendToFormData(formData, key, value)
    }
  }
  return formData
}
function appendToFormData(formData: FormData, key: string, value: any) {
  if (value instanceof Date) return formData.append(key, value.toISOString())
  if (value instanceof File) return formData.append(key, value, value.name)
  if (typeof value === 'boolean') return formData.append(key, value ? '1' : '0')
  if (value === null) return formData.append(key, '')
  if (typeof value !== 'object') return formData.append(key, value)
  if (Array.isArray(value) && hasFilesDeep(value)) {
    for (let i = 0; i < value.length; i++) {
      formData.append(key + '[' + i + ']', value[i], value[i].name)
    }
    return formData
  }
  if (typeof value === 'object') return objectToFormData(value, formData, key)
  throw new Error(`Unexpected value type: ${typeof value}`)
}
export function hasFilesDeep(obj: any): boolean {
  if (obj === null) return false
  if (typeof obj === 'object') {
    const values = Object.values(obj)
    for (let i = 0; i < values.length; i++) {
      if (isFile(values[i])) return true
    }
  }
  if (Array.isArray(obj)) {
    const firstNonNullElement = obj.find((el) => el !== null)
    return firstNonNullElement ? hasFilesDeep(firstNonNullElement) : false
  }
  return isFile(obj)
}
export function hasFiles(form: any) {
  for (const prop in form) {
    if (Object.prototype.hasOwnProperty.call(form, prop) && hasFilesDeep(form[prop])) {
      return true
    }
  }
  return false
}
