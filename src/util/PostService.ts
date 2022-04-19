import BaseService from '../core/BaseService'

class PostService extends BaseService {
  constructor(parameters = {}) {
    super('posts', parameters)
  }

  tags<T>(id: string | number) {
    return this.submit<T>('get', `${id}/tags`)
  }

  throwException<T>(id: string | number) {
    return this.submit<T>('unlink', `${id}/tags`)
  }
}

export default PostService
