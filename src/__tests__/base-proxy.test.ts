import Axios from 'axios'
import BaseProxy from '../core/BaseProxy'
import MockAdapter from 'axios-mock-adapter'
import PostProxy from '../core/PostPorxy'
import type { ValidatorType } from '../core/Validator'
import Validator from '../core/Validator'

let proxy: PostProxy
let mockAdapter
let validator: ValidatorType

describe('BaseProxy', () => {
  beforeEach(() => {
    validator = Validator
    const axios = Axios.create({ baseURL: 'http://drink-order-api.test' })
    BaseProxy.$http = axios
    proxy = new PostProxy()
    mockAdapter = new MockAdapter(axios)
  })
  it('will fetch all records', async () => {
    const items = [{ first_name: 'Chantouch', last_name: 'Sek' }]
    mockAdapter.onGet('/posts').reply(200, { data: items })
    try {
      const { data } = await proxy.removeParameters().all()
      expect(data).toEqual(items)
    } catch (e) {
      console.log('all:', e)
    }
  })

  it('will fetch all records with query params', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter.onGet('/posts?id=1&first_name=Dara').reply(200, { data: items })
    const { data } = await proxy
      .setParameter('id', 1)
      .setParameters({ first_name: 'Dara' })
      .all()
    expect(data).toEqual(items)
  })
  it('it should be able to remove parameter(s)', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter.onGet('/posts?id=1').reply(200, { data: items })
    const { data } = await proxy
      .setParameter('id', 1)
      .setParameters({ first_name: 'Dara', last_name: 'Sek' })
      .removeParameter('first_name')
      .removeParameters(['last_name'])
      .all()
    expect(data).toEqual(items)
  })

  it('it should find an item by id', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onGet('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.find(1)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('find:', e)
    }
  })

  it('it should find an item by id', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(201, { data: item })
    try {
      const { data } = await proxy.post(item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('post:', e)
    }
  })

  it('transforms the data to a FormData object if there is a File', async () => {
    const file = new File(['hello world!'], 'myfile')
    const form = { field1: {}, field2: {} }
    form.field1 = {
      foo: 'testFoo',
      bar: ['testBar1', 'testBar2'],
      baz: new Date(Date.UTC(2012, 3, 13, 2, 12)),
    }
    form.field2 = file

    mockAdapter.onPost('/posts').reply((request) => {
      expect(request.data).toBeInstanceOf(FormData)
      expect(request.data.get('field1[foo]')).toBe('testFoo')
      expect(request.data.get('field1[bar][0]')).toBe('testBar1')
      expect(request.data.get('field1[bar][1]')).toBe('testBar2')
      expect(request.data.get('field1[baz]')).toBe('2012-04-13T02:12:00.000Z')
      expect(request.data.get('field2')).toEqual(file)

      expect(getFormDataKeys(request.data)).toEqual([
        'field1[foo]',
        'field1[bar][0]',
        'field1[bar][1]',
        'field1[baz]',
        'field2',
      ])
      return [200, {}]
    })

    await proxy.post(form)
  })

  it('transforms the data to a FormData object if there is a File with post', async () => {
    const file = new File(['hello world!'], 'my-file')
    const form = { id: 1, user: {}, file }
    form.user = {
      id: 1,
      name: 'testFoo',
      villages: ['testBar1', 'testBar2'],
      date: new Date(Date.UTC(2012, 3, 13, 2, 12)),
    }
    mockAdapter.onPost('/posts/' + 1).reply((request) => {
      expect(request.data).toBeInstanceOf(FormData)
      expect(request.data.get('user[name]')).toBe('testFoo')
      expect(request.data.get('user[villages][0]')).toBe('testBar1')
      expect(request.data.get('user[villages][1]')).toBe('testBar2')
      expect(request.data.get('user[date]')).toBe('2012-04-13T02:12:00.000Z')
      expect(request.data.get('file')).toEqual(file)
      expect(getFormDataKeys(request.data)).toEqual([
        'id',
        'user[id]',
        'user[name]',
        'user[villages][0]',
        'user[villages][1]',
        'user[date]',
        'file',
        '_method',
      ])
      return [200, {}]
    })

    await proxy.putWithFile(form.id, form)
  })

  it('transforms the boolean values in FormData object to "1" or "0"', async () => {
    const file = new File(['hello world!'], 'myfile')
    const form = { field1: {}, field2: null }
    form.field1 = {
      foo: true,
      bar: false,
    }
    form.field2 = file

    mockAdapter.onPost('/posts').reply((request) => {
      expect(request.data).toBeInstanceOf(FormData)
      expect(request.data.get('field1[foo]')).toBe('1')
      expect(request.data.get('field1[bar]')).toBe('0')
      expect(request.data.get('field2')).toEqual(file)

      expect(getFormDataKeys(request.data)).toEqual([
        'field1[foo]',
        'field1[bar]',
        'field2',
      ])
      return [200, {}]
    })

    await proxy.post(form)
  })

  it('it should throw errors message when data is not valid', async () => {
    const item = { first_name: null, last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(422, {
      errors: { first_name: ['The first name field is required'] },
    })
    try {
      await proxy.post(item)
    } catch (e) {
      // console.log('post:', e)
    }
    expect(validator.has('first_name')).toBeTruthy()
  })

  it('it should store the item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(201, { data: item })
    try {
      const { data } = await proxy.store(item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('store:', e)
    }
  })

  it('it should be able to put item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPut('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.put(item.id, item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('put:', e)
    }
  })

  it('it should be able to patch item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPatch('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.patch(item.id, item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('patch:', e)
    }
  })

  it('it should be able to patch item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onDelete('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.delete(item.id)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('delete:', e)
    }
  })

  it('can accept a custom http instance in options', () => {
    BaseProxy.$http = Axios.create({ baseURL: 'http://another-example.com' })
    expect(proxy.$http.defaults.baseURL).toBe('http://another-example.com')

    BaseProxy.$http = Axios.create()
    expect(proxy.$http.defaults.baseURL).toBe(undefined)
  })
})

function getFormDataKeys(formData) {
  // This is because the FormData.keys() is missing from the jsdom implementations.
  return formData[Object.getOwnPropertySymbols(formData)[0]]._entries.map(
    (e) => e.name,
  )
}
