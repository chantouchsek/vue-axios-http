import { objectToFormData } from '../util/formData'

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
})
