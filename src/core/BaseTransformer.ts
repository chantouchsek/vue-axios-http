import snakeCaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'

class BaseTransformer {
  static fetchCollection<T = any>(items: T[], camelKey?: boolean) {
    if (!items) {
      return []
    }
    return items.map((item: T) => this.fetch(item, camelKey))
  }

  static sendCollection<T = any>(items: T[], snakeKey?: boolean) {
    if (!items) {
      return []
    }
    return items.map((item: T) => this.send(item, snakeKey))
  }

  static fetch<T = any>(item: T, camelKey?: boolean): T | Record<string, any> {
    return camelKey ? camelcaseKeys(item, { deep: true }) : item
  }

  static send<T = any>(item: T, snakeKey?: boolean): T | Record<string, any> {
    return snakeKey ? snakeCaseKeys(item) : item
  }
}

export default BaseTransformer
