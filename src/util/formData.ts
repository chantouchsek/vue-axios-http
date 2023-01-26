import { hasOwnProperty, isArray, isFile } from './objects'

export function objectToFormData(object: any, formData = new FormData(), parent = ''): FormData {
  if (object === null || object === 'undefined' || object.length === 0) {
    formData.append(parent, object)
  } else {
    for (const property in object) {
      if (hasOwnProperty(object, property)) {
        appendToFormData(formData, getKey(parent, property), object[property])
      }
    }
  }
  return formData
}

function getKey(parent: any, property: any) {
  return parent ? parent + '[' + property + ']' : property
}

function appendToFormData(formData: FormData, key: string, value: any) {
  if (value instanceof Date) {
    return formData.append(key, value.toISOString())
  }

  if (value instanceof File) {
    return formData.append(key, value, value.name)
  }

  if (typeof value === 'boolean') {
    return formData.append(key, value ? '1' : '0')
  }

  if (value === null) {
    return formData.append(key, '')
  }

  if (typeof value !== 'object') {
    return formData.append(key, value)
  }

  if (isArray(value) && hasFilesDeep(value)) {
    for (let i = 0; i < value.length; i++) {
      formData.append(key + '[' + i + ']', value[i], value[i].name)
    }
    return formData
  }

  objectToFormData(value, formData, key)
}

export function hasFilesDeep(obj: any): boolean {
  if (obj === null) return false
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (isFile(obj[key])) return true
    }
  }
  if (isArray(obj)) {
    let f = ''
    for (const key in obj) {
      if (hasOwnProperty(obj, key)) {
        f = key
        break
      }
    }
    return hasFilesDeep(obj[f])
  }
  return isFile(obj)
}

export function hasFiles(form: any): boolean {
  for (const prop in form) {
    const hasProp = hasOwnProperty(form, prop) || typeof window !== 'undefined'
    if (hasProp && hasFilesDeep(form[prop])) {
      return true
    }
  }
  return false
}
