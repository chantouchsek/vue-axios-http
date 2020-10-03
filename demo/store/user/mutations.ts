import { ALL } from './mutation-types'

export default {
  [ALL](state, { items, pagination }) {
    state.all = items
    state.pagination = pagination
  },
}
