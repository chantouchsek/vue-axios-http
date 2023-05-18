export const toCamelCase = (e: string) => e.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
export const toSnakeCase = (e: string) => (e.match(/([A-Z])/g) ? e.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`) : e)
