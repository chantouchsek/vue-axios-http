import Axios from 'axios'
import BaseProxy from '../core/BaseProxy'
import PostProxy from '../util/PostPorxy'
import MockAdapter from 'axios-mock-adapter'
import BaseTransformer from '../core/BaseTransformer'
import PaginationTransformer from '../core/PaginationTransformer'

let proxy: PostProxy
let mockAdapter: MockAdapter

describe('PostProxy', () => {
  beforeEach(() => {
    const axios = Axios.create({ baseURL: 'https://mock-api.test' })
    BaseProxy.$http = axios
    proxy = new PostProxy()
    mockAdapter = new MockAdapter(axios)
    mockAdapter.reset()
  })

  it('it should get tags by post id', async () => {
    const items = {
      data: [{ name: 'Chantouch', post_id: 1 }],
      meta: {
        pagination: { count: 1, current_page: 1, perPage: 20 },
        include: [],
      },
    }
    mockAdapter.onGet('/posts/1/tags').reply(200, items)
    const { data, meta = {} } = await proxy.tags(1)
    const all = {
      items: BaseTransformer.fetchCollection(data),
      pagination: PaginationTransformer.fetch(meta),
    }
    expect(meta).toHaveProperty('pagination')
    expect(data.length).toEqual(1)
    expect(all.pagination.page).toEqual(1)
  })
  it('it should throw exception if method is not inlist', async () => {
    const items = {
      data: [{ name: 'Chantouch', post_id: 1 }],
      meta: {
        pagination: { count: 1, current_page: 1, perPage: 20 },
        include: [],
      },
    }
    mockAdapter.onGet('/posts/1/tags').reply(500, items)
    try {
      await proxy.throwException(1)
    } catch (e: any) {
      expect(e.message).toEqual(
        '`unlink` is not a valid request type, must be one of: `get`, `delete`, `head`, `post`, `put`, `patch`.',
      )
    }
  })
})
