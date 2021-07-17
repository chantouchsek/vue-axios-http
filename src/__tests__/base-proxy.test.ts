import Axios from 'axios'
import BaseProxy from '../core/BaseProxy'
import MockAdapter from 'axios-mock-adapter'
import PostProxy from '../core/PostPorxy'
import type { ValidatorType } from '../core/Validator'
import Validator from '../core/Validator'
import BaseTransformer from '../core/BaseTransformer'
import PaginationTransformer from '../core/PaginationTransformer'
import { merge } from '../util/objects'

let proxy: PostProxy
let mockAdapter: MockAdapter
let validator: ValidatorType

describe('BaseProxy', () => {
  beforeEach(() => {
    validator = Validator
    const axios = Axios.create({ baseURL: 'https://mock-api.test' })
    BaseProxy.$http = axios
    proxy = new PostProxy()
    mockAdapter = new MockAdapter(axios)
    mockAdapter.reset()
  })

  it('check if http was installed', async () => {
    BaseProxy.$http = undefined
    try {
      await proxy.all()
    } catch (e) {
      expect(e.message).toBe('Vue Api Queries, No http library provided.')
    }
  })

  it('it should fetch items with pagination', async () => {
    const items = {
      data: [{ first_name: 'Chantouch', last_name: 'Sek' }],
      pagination: { count: 1, page: 1, perPage: 20 },
    }
    mockAdapter.onGet('/posts').reply(200, items)
    const { data, pagination = {} } = await proxy.removeParameters().all()
    const all = {
      items: BaseTransformer.fetchCollection(data),
      pagination: PaginationTransformer.fetch(pagination),
    }
    expect(all).toHaveProperty('pagination')
    expect(data).toEqual(all.items)
    expect(all.pagination.page).toEqual(1)
  })

  it('it should fetch items with meta that has pagination', async () => {
    const items = {
      data: [{ first_name: 'Chantouch', last_name: 'Sek' }],
      meta: {
        pagination: { count: 1, current_page: 1, perPage: 20 },
        include: [],
      },
    }
    mockAdapter.onGet('/posts').reply(200, items)
    const { data, meta = {} } = await proxy.removeParameters().all()
    const all = {
      items: BaseTransformer.fetchCollection(data),
      pagination: PaginationTransformer.fetch(meta),
    }
    expect(meta).toHaveProperty('pagination')
    expect(data.length).toEqual(1)
    expect(all.pagination.page).toEqual(1)
  })

  it('should assign default object meta if it is null or undefined', async () => {
    const items = {
      data: [{ first_name: 'Chantouch', last_name: 'Sek' }],
      meta: undefined,
    }
    mockAdapter.onGet('/posts').reply(200, items)
    const { data, meta } = await proxy.removeParameters([]).all()
    const all = {
      items: BaseTransformer.fetchCollection(data),
      pagination: PaginationTransformer.fetch(meta),
    }
    expect(meta).toBeUndefined()
    expect(data.length).toEqual(1)
    expect(all.pagination.currentPage).toEqual(1)
  })

  it('will fetch all records', async () => {
    const items = [{ first_name: 'Chantouch', last_name: 'Sek' }]
    mockAdapter.onGet('/posts').reply(200, { data: items })
    const { data } = await proxy.removeParameters().all()
    expect(data).toEqual(items)
  })

  it('Check network server return 500', async () => {
    mockAdapter.onGet('/posts').networkError()
    try {
      await proxy.all()
    } catch (e) {
      expect(e.message).toBe('Network Error')
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

  it('should set parameter with empty value', async () => {
    const user1 = {
      first_name: 'Dara',
      last_name: 'Hok',
      id: 1,
      songs: [1, 2, 3],
    }
    const user2 = merge(user1, {
      last_name: 'Hok 01',
      songs: [4, 5, 6],
      song: { name: 'Love song...' },
      pc: null,
    })
    const items = [user2, { first_name: 'Chantouch', last_name: 'Sek', id: 2 }]
    mockAdapter
      .onGet('/posts?id=1&last_name=Hok&search[name]=hello&first_name=Dara')
      .reply(200, { data: items })
    const { data } = await proxy
      .setParameter('id=1&last_name=Hok&search[name]=hello')
      .setParameters({ first_name: 'Dara' })
      .all()
    expect(proxy.parameters).toEqual({
      id: '1',
      first_name: 'Dara',
      last_name: 'Hok',
      search: {
        name: 'hello',
      },
    })
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
  it('it should accept query params as object', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter
      .onGet('/posts?search[id]=1&first_name=Dara')
      .reply(200, { data: items })
    const params = {
      search: { id: 1 },
      first_name: 'Dara',
      last_name: 'Hok',
    }
    const { data } = await proxy
      .setParameters(params)
      .removeParameters(['last_name'])
      .all()
    expect(data).toEqual(items)
    expect(proxy.parameters).toEqual({ search: { id: 1 }, first_name: 'Dara' })
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
    const form: any = { field1: {}, field2: {}, files: [] }
    form.field1 = {
      foo: 'testFoo',
      bar: ['testBar1', 'testBar2'],
      baz: new Date(Date.UTC(2012, 3, 13, 2, 12)),
    }
    form.field2 = file
    form.files = [{ file }]

    mockAdapter.onPost('/posts').reply((request) => {
      expect(request.data).toBeInstanceOf(FormData)
      expect(request.data.get('field1[foo]')).toBe('testFoo')
      expect(request.data.get('field1[bar][0]')).toBe('testBar1')
      expect(request.data.get('field1[bar][1]')).toBe('testBar2')
      expect(request.data.get('field1[baz]')).toBe('2012-04-13T02:12:00.000Z')
      expect(request.data.get('field2')).toEqual(file)
      expect(request.data.get('files[0][file]')).toEqual(file)

      expect(getFormDataKeys(request.data)).toEqual([
        'field1[foo]',
        'field1[bar][0]',
        'field1[bar][1]',
        'field1[baz]',
        'field2',
        'files[0][file]',
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
    const form: any = { field1: {}, field2: null }
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
    BaseProxy.$http = Axios.create({ baseURL: 'https://another-example.com' })
    expect(proxy.$http.defaults.baseURL).toBe('https://another-example.com')

    BaseProxy.$http = Axios.create()
    expect(proxy.$http.defaults.baseURL).toBe(undefined)
  })
})

function getFormDataKeys(formData: any) {
  // This is because the FormData.keys() is missing from the jsdom implementations.
  return formData[Object.getOwnPropertySymbols(formData)[0]]._entries.map(
    (e: any) => e.name,
  )
}
