import snakeCaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'

class BaseTransformer {
  static fetchCollection<T>(items: T[], camelKey?: boolean): T[] {
    return items.map((item: T) => this.fetch(item, camelKey))
  }

  static sendCollection<T>(
    items: T[],
    snakeKey?: boolean,
  ): ({ [p: string]: any } | T)[] {
    return items.map((item: T) => this.send(item, snakeKey))
  }

  static fetch<T>(item: T, camelKey?: boolean) {
    return camelKey ? camelcaseKeys(item, { deep: true }) : item
  }

  static send<T>(item: T, snakeKey?: boolean) {
    return snakeKey ? snakeCaseKeys(item) : item
  }
}

export default BaseTransformer
