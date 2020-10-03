import * as types from './mutation-types'
import UserProxy from '~/proxies/UserProxy'
// import { OrganizationTransformer, PaginationTransformer } from '~/transformers'

const proxy = new UserProxy()

const all = async ({ commit }, payload?: PayloadOptions): Promise<any> => {
  const { fn } = payload || {}
  if (typeof fn === 'function') {
    await fn(proxy)
  }
  try {
    const { data, meta } = await proxy.all()
    console.log(data)
    const item = {
      items: data,
      pagination: meta,
    }
    commit(types.ALL, item)
  } catch (e) {
    console.log(e)
    commit(types.ALL, { items: [], pagination: {} })
  }
}

export default { all }

export type PayloadOptions = {
  [key in string | number | any]: any
}
