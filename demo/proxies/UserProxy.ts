import { BaseProxy } from 'vue-api-queries'

export default class UserProxy extends BaseProxy {
  constructor(parameters = {}) {
    super('users', parameters)
  }
}
