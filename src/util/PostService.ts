import BaseService from '../core/BaseService'

class PostService extends BaseService {
  constructor(parameters = {}) {
    super('posts', parameters)
  }

  tags<T = any>(id: string | number) {
    return this.submit<T>('get', `${id}/tags`)
  }
}

export default PostService
