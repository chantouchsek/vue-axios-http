import BaseProxy from '../core/BaseProxy'

class PostProxy extends BaseProxy {
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

export default PostProxy
