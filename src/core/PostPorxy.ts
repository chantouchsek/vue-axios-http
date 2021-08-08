import BaseProxy from './BaseProxy'

class PostProxy extends BaseProxy {
  constructor(parameters = {}) {
    super('posts', parameters)
  }

  tags<T>(id: string | number) {
    return this.submit<T>('get', `${id}/tags`)
  }
}

export default PostProxy
