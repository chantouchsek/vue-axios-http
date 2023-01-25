export function removeDoubleSlash(url: string) {
  return url.replace(/\/\//g, '/')
}
export const toCamelCase = (e: string) => {
  return e.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}
export const toSnakeCase = (e: string) => {
  if (!e.match(/([A-Z])/g)) return e
  return e.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
