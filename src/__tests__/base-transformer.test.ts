import BaseTransformer from '../core/BaseTransformer'

describe('Base transformer.', () => {
  test('It should fetch an item without camelCase', () => {
    const item = {
      username: 'My name',
      user_id: 1,
    }
    expect(BaseTransformer.fetch(item, false)).toEqual(item)
  })
  test('It should fetch collection of items without camelCase', () => {
    const item = [
      {
        username: 'My name',
        user_id: 1,
      },
    ]
    expect(BaseTransformer.fetchCollection(item, false)).toEqual(item)
  })
  test('It should fetch an item as camelCase', () => {
    const item = {
      username: 'My name',
      user_id: 1,
    }
    const transformed = {
      username: 'My name',
      userId: 1,
    }
    expect(BaseTransformer.fetch(item, true)).toEqual(transformed)
  })
  test('It should fetch collection of items as camelCase', () => {
    const item = [
      {
        username: 'My name',
        user_id: 1,
      },
    ]
    const transformed = [
      {
        username: 'My name',
        userId: 1,
      },
    ]
    expect(BaseTransformer.fetchCollection(item, true)).toEqual(transformed)
  })
  test('it should send an item without snake_case', () => {
    const item = {
      username: 'My name',
      userId: 1,
    }
    expect(BaseTransformer.send(item, false)).toEqual(item)
  })
  test('it should send collection of items without snake_case', () => {
    const item = [
      {
        username: 'My name',
        userId: 1,
      },
    ]
    expect(BaseTransformer.sendCollection(item, false)).toEqual(item)
  })
  test('it should send an item with snake_case', () => {
    const item = {
      username: 'My name',
      userId: 1,
    }
    const transformed = {
      username: 'My name',
      user_id: 1,
    }
    expect(BaseTransformer.send(item, true)).toEqual(transformed)
  })
  test('it should send collection of items with snake_case', () => {
    const item = [
      {
        username: 'My name',
        userId: 1,
      },
    ]
    const transformed = [
      {
        username: 'My name',
        user_id: 1,
      },
    ]
    expect(BaseTransformer.sendCollection(item, true)).toEqual(transformed)
  })
  it('should return empty array of null or undefined', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(BaseTransformer.fetchCollection(undefined, true)).toEqual([])
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(BaseTransformer.sendCollection(null, true)).toEqual([])
  })
})
