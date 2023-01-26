import Axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import BaseService from '../core/BaseService'
import PostService from '../util/PostService'

let service: PostService
let mockAdapter: MockAdapter

describe('PostService', () => {
  beforeEach(() => {
    const axios = Axios.create({ baseURL: 'https://mock-api.test' })
    BaseService.$http = axios
    service = new PostService()
    mockAdapter = new MockAdapter(axios)
    mockAdapter.reset()
  })

  it('it should get tags by post id', async () => {
    const items = {
      data: [{ name: 'Chantouch', post_id: 1 }],
      meta: {
        pagination: { count: 1, page: 1, perPage: 20 },
        include: [],
      },
    }
    mockAdapter.onGet('/posts/1/tags').reply(200, items)
    const { data, meta } = await service.removeParameters([]).tags(1)
    const item = {
      items: data,
      pagination: meta.pagination,
    }
    expect(meta).toHaveProperty('pagination')
    expect(data.length).toEqual(1)
    expect(item.pagination.page).toEqual(1)
  })
})
