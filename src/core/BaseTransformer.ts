import snakeCaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'

class BaseTransformer {
  static fetchCollection(items: Array<any>, camelKey?: boolean): Array<any> {
    return items.map((item: any) => this.fetch(item, camelKey))
  }

  static sendCollection(items: Array<any>, snakeKey?: boolean): Array<any> {
    return items.map((item: any) => this.send(item, snakeKey))
  }

  static fetch(item: any, camelKey?: boolean) {
    return camelKey ? camelcaseKeys(item, { deep: true }) : item
  }

  static send(item: any, snakeKey?: boolean) {
    return snakeKey ? snakeCaseKeys(item) : item
  }
}

export default BaseTransformer
