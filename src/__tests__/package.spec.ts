import Vue from 'vue'
import VueApiQueries from '../'
import { addElemWithDataAppToBody, disableTransitions } from '../util/createDom'
import { sleep } from '../util/promise'
import { mount } from '@vue/test-utils'

describe('Vue Api Queries', () => {
  disableTransitions()
  addElemWithDataAppToBody()
  Vue.use(VueApiQueries, {
    errorProperty: 'errors',
  })

  test('Get plugin installed', async () => {
    await sleep(100)
    await Vue.nextTick()
    await sleep(5)
    expect(document.body).toMatchSnapshot()
  })

  test('Get errors from vue component', async () => {
    const template = {
      data() {
        return {
          t1: false,
          t2: '',
        }
      },
      template: `
      <div>
        <input type="checkbox" name="t1" class="foo" v-model="t1" />
        <input type="radio" name="t2" class="foo" value="foo" v-model="t2"/>
        <input type="radio" name="t2" class="bar" value="bar" v-model="t2"/>
        <span id="age">{{ $errors.first('age') }}</span>
      </div>`,
    }
    const wrapper = mount(template)
    const errors = {
      first_name: ['This field is required'],
      last_name: ['This field is required'],
      age: ['This field is required'],
    }
    wrapper.vm.$errors.fill(errors)
    expect(wrapper.vm.$errors.count()).toEqual(3)
    expect(wrapper.vm.$errors.has('age')).toBeTruthy()
    expect(wrapper.vm.$errors.first('age')).toBe('This field is required')
    expect(template).toMatchSnapshot()
  })
})
