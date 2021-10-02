import { objectToFormData } from '../util'

describe('FormData', () => {
  it('if object is null, undefined or array length is zero', async () => {
    const formData = objectToFormData({
      null: '',
      items1: [],
      name: null,
    })
    expect(formData.get('null')).toBe('')
    expect(formData.get('items1')).toHaveLength(0)
    expect(formData.get('name')).toBe('')
  })
  it('window is undefined', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window
    const formData = objectToFormData({
      null: '',
      items1: [],
      name: null,
      __proto__: 'Hi',
    })
    expect(formData.get('null')).toBe('')
    expect(formData.get('items1')).toHaveLength(0)
    expect(formData.get('name')).toBe('')
  })
})
