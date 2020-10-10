import snakeCaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'

class BaseTransformer {
  static fetchCollection(items: any[], camelCaseKey?: boolean): any[] {
    return items.map((item: any) => this.fetch(item, camelCaseKey))
  }

  static sendCollection(items: any[], snakeCaseKey?: boolean): any[] {
    return items.map((item: any) => this.send(item, snakeCaseKey))
  }

  static fetch(item: any, camelCaseKey?: boolean): any {
    if (camelCaseKey) {
      return camelcaseKeys(item, { deep: true })
    }
    return item
  }

  static send(item: any, snakeCaseKey = true): any {
    if (snakeCaseKey) {
      return snakeCaseKeys(item)
    }
    return item
  }
}

export default BaseTransformer
