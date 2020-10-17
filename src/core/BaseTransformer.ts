import snakeCaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'

class BaseTransformer {
  static fetchCollection(
    items: Array<Attribute>,
    camelCaseKey?: boolean,
  ): Array<Attribute> {
    return items.map((item: Attribute) => this.fetch(item, camelCaseKey))
  }

  static sendCollection(
    items: Array<Attribute>,
    snakeCaseKey?: boolean,
  ): Array<Attribute> {
    return items.map((item: Attribute) => this.send(item, snakeCaseKey))
  }

  static fetch(item: Attribute, camelCaseKey?: boolean): Attribute {
    if (camelCaseKey) {
      return camelcaseKeys(item, { deep: true })
    }
    return item
  }

  static send(item: Attribute, snakeCaseKey?: boolean): Attribute {
    if (snakeCaseKey) {
      return snakeCaseKeys(item)
    }
    return item
  }
}

export default BaseTransformer

export type Attribute = {
  [key in string | number]: any
}
