export function isFile(object: File | FileList): boolean {
  return object instanceof File || object instanceof FileList
}
export function is(errors: string[], errorsToCheck: string[] | string): boolean {
  return Array.isArray(errorsToCheck) ? errorsToCheck.some((w) => is(errors, w)) : errors.includes(errorsToCheck)
}
