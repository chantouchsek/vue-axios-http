export function removeDoubleSlash(url: string) {
  return url.replace(/\/\//g, '/')
}
