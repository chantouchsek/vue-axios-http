import type { ValidatorType } from '../core/Validator'
import Axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { merge } from 'lodash'
import BaseService from '../core/BaseService'
import Validator from '../core/Validator'
import PostService from '../util/PostService'

let service: PostService
let mockAdapter: MockAdapter
let validator: ValidatorType

describe('BaseService', () => {
  beforeEach(() => {
    validator = Validator
    const axios = Axios.create({ baseURL: 'https://mock-api.test' })
    BaseService.$http = axios
    BaseService.$errorProperty = 'message'
    service = new PostService()
    mockAdapter = new MockAdapter(axios)
    mockAdapter.reset()
  })

  it('check if http was installed', async () => {
    BaseService.$http = undefined as never
    try {
      await service.all()
    } catch (e) {
      const { message } = e as any
      expect(message).toBe('Vue Axios Http, No http library provided.')
    }
  })

  it('it should fetch items with pagination', async () => {
    const items = {
      data: [{ first_name: 'Chantouch', last_name: 'Sek' }],
      pagination: { count: 1, page: 1, perPage: 20 },
    }
    mockAdapter.onGet('/posts').reply(200, items)
    const { data, pagination } = await service.removeParameters().all()
    const all = {
      pagination,
      items: data,
    }
    expect(all).toHaveProperty('pagination')
    expect(data).toEqual(all.items)
    expect(all.pagination.page).toEqual(1)
  })

  it('it should fetch items with meta that has pagination', async () => {
    const items = {
      data: [{ first_name: 'Chantouch', last_name: 'Sek' }],
      meta: {
        pagination: { count: 1, page: 1, perPage: 20 },
        include: [],
      },
    }
    mockAdapter.onGet('/posts').reply(200, items)
    const { data, meta } = await service.removeParameters().all()
    const item = {
      items: data,
      pagination: meta.pagination,
    }
    expect(meta).toHaveProperty('pagination')
    expect(data.length).toEqual(1)
    expect(item.pagination.page).toEqual(1)
  })

  it('will fetch all records', async () => {
    const items = [{ first_name: 'Chantouch', last_name: 'Sek' }]
    mockAdapter.onGet('/posts').reply(200, { data: items })
    const { data } = await service.removeParameters().all()
    expect(data).toEqual(items)
  })

  it('Check network server return 500', async () => {
    mockAdapter.onGet('/posts').networkError()
    try {
      await service.all()
    } catch (e) {
      const { message } = e as any
      expect(message).toBe('Network Error')
    }
  })

  it('will fetch all records with query params', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter.onGet('/posts?id=1&first_name=Dara').reply(200, { data: items })
    const parameters = { first_name: 'Dara', id: 1 }
    const { data } = await service.setParameter('id', 1).setParameters(parameters).all()

    expect(data).toEqual(items)
    expect(service.parameters).toEqual(parameters)
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
    mockAdapter.onGet('/posts?id=1&last_name=Hok&search[name]=hello&first_name=Dara').reply(200, { data: items })
    const { data } = await service
      .setParameter('id=1&last_name=Hok&search[name]=hello')
      .setParameters({ first_name: 'Dara' })
      .all()
    expect(service.parameters).toEqual({
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
    const { data } = await service
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
    mockAdapter.onGet('/posts?search[id]=1&first_name=Dara').reply(200, { data: items })
    const params = {
      search: { id: 1 },
      first_name: 'Dara',
      last_name: 'Hok',
    }
    const { data } = await service.setParameters(params).removeParameters(['last_name']).all()
    expect(data).toEqual(items)
    expect(service.parameters).toEqual({
      search: { id: 1 },
      first_name: 'Dara',
    })
  })

  it('it should find an item by id', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onGet('posts/1').reply(200, { data: item })
    const { data } = await service.find(1)
    expect(data).toEqual(item)
  })

  it('it should create a item by post', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(201, { data: item })
    const { data } = await service.post(item)
    expect(data).toEqual(item)
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
    form.files = [file]

    mockAdapter.onPost('/posts').reply((request) => {
      expect(request.data).toBeInstanceOf(FormData)
      expect(request.data.get('field1[foo]')).toBe('testFoo')
      expect(request.data.get('field1[bar][0]')).toBe('testBar1')
      expect(request.data.get('field1[bar][1]')).toBe('testBar2')
      expect(request.data.get('field1[baz]')).toBe('2012-04-13T02:12:00.000Z')
      expect(request.data.get('field2')).toEqual(file)
      expect(request.data.get('files[0]')).toEqual(file)

      expect(getFormDataKeys(request.data)).toEqual([
        'field1[foo]',
        'field1[bar][0]',
        'field1[bar][1]',
        'field1[baz]',
        'field2',
        'files[0]',
      ])
      return [200, {}]
    })

    await service.store(form)
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
    mockAdapter.onPost('/posts/1').reply((request) => {
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

    await service.put(form.id, form)
  })

  it('transforms the boolean values in FormData object to "1" or "0"', async () => {
    const file = new File(['hello world!'], 'myfile')
    const form: any = { field1: {}, field2: null, files: null }
    form.field1 = {
      foo: true,
      bar: false,
    }
    form.field2 = file
    form.files = [file]
    form.__proto__ = file

    mockAdapter.onPost('/posts').reply((request) => {
      expect(request.data).toBeInstanceOf(FormData)
      expect(request.data.get('field1[foo]')).toBe('1')
      expect(request.data.get('field1[bar]')).toBe('0')
      expect(request.data.get('field2')).toEqual(file)
      expect(request.data.get('files[0]')).toEqual(file)
      expect(request.data.get('__proto__')).toEqual(null)

      expect(getFormDataKeys(request.data)).toEqual(['field1[foo]', 'field1[bar]', 'field2', 'files[0]'])
      return [200, {}]
    })

    await service.post(form)
  })

  it('it should throw errors message when data is not valid', async () => {
    const item = { first_name: null, last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').replyOnce(422, {
      message: { first_name: 'The first name field is required' },
    })
    try {
      await service.post(item)
    } catch (e) {
      const { message } = e as any
      expect(message).toBe('Request failed with status code 422')
    }
    expect(validator.has('first_name')).toBeTruthy()
  })

  it('it should store the item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(201, { data: item })
    const { data } = await service.store(item)
    expect(data).toEqual(item)
  })

  it('it should be able to put item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPut('posts/1').reply(200, { data: item })
    const { data } = await service.put(item.id, item)
    expect(data).toEqual(item)
  })

  it('it should be able to put item without id parameter', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPut('posts').reply(200, { data: item })
    const { data } = await service.put(item)
    expect(data).toEqual(item)
  })

  it('it should be able to patch item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPatch('posts/1').reply(200, { data: item })
    const { data } = await service.patch(item.id, item)
    expect(data).toEqual(item)
  })

  it('it should be able to patch item without id', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPatch('posts').reply(200, { data: item })
    const { data } = await service.patch(item)
    expect(data).toEqual(item)
  })

  it('it should be able to update an item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPatch('posts/1').reply(200, { data: item })
    const { data } = await service.update(item.id, item)
    expect(data).toEqual(item)
  })

  it('it should be able to delete an item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onDelete('posts/1').reply(200, { data: item })
    const { data } = await service.delete(item.id)
    expect(data).toEqual(item)
  })

  it('it should be able to remove an item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onDelete('posts/1').reply(200, { data: item })
    const { data } = await service.remove(item.id)
    expect(data).toEqual(item)
  })

  it('can accept a custom http instance in options', () => {
    BaseService.$http = Axios.create({ baseURL: 'https://another-example.com' })
    expect(service.$http.defaults.baseURL).toBe('https://another-example.com')

    BaseService.$http = Axios.create()
    expect(service.$http.defaults.baseURL).toBe(undefined)
  })
})
describe('BaseService -> Remove parameters', () => {
  beforeEach(() => {
    validator = Validator
    const axios = Axios.create({ baseURL: 'https://mock-api.test' })
    BaseService.$http = axios
    BaseService.$resetParameter = true
    BaseService.$errorProperty = 'message'

    service = new PostService()
    mockAdapter = new MockAdapter(axios)
    mockAdapter.reset()
  })

  it('should clear the parameters, if the option `removeParam` is true', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter.onGet('/posts?id=1&first_name=Dara').reply(200, { data: items })
    const parameters = { first_name: 'Dara', id: 1 }
    const { data } = await service.setParameter('id', 1).setParameters(parameters).all()

    expect(data).toEqual(items)
    expect(service.parameters).toEqual({})
  })
})

function getFormDataKeys(formData: any) {
  // This is because the FormData.keys() is missing from the jsdom implementations.
  return formData[Object.getOwnPropertySymbols(formData)[0]]._entries.map((e: any) => e.name)
}
