import { isFile, cloneDeep, hasOwnProperty, merge } from '../util'

describe('Object Test', () => {
  // const { window, File } = global
  afterEach(() => {
    // global.window = window
    // global.File = File
  })
  it('check if object is a file Instance', () => {
    const file = new File(['hello world!'], 'myfile')
    expect(isFile(file)).toBeTruthy()
  })
  /*
  it('check if window is undefined', () => {
    delete global.window
    const file = new File(['hello world!'], 'myfile')
    expect(isFile(file)).toBeFalsy()
  })
  it('check if File is not function', () => {
    const file = new File(['hello world!'], 'myfile')
    delete global.File
    expect(isFile(file)).toBeFalsy()
  })
  */
})
describe('cloneDeep', () => {
  it('Object is null', () => {
    expect(cloneDeep(null)).toBe(null)
  })
  it('Object is typeof File', () => {
    const file = new File(['hello world!'], 'myfile')
    expect(cloneDeep(file)).toBeInstanceOf(File)
  })
  it('Object is typeof Array', () => {
    const obj = [{ name: 'Chantouch' }]
    expect(cloneDeep(obj)).toBeInstanceOf(Object)
  })
  it('Has own property undefined', () => {
    const obj = [{ name: 'Chantouch' }]
    expect(hasOwnProperty(obj, undefined)).toBeFalsy()
  })
  it('Merge object into object', () => {
    const obj1 = { name: 'Chantouch' }
    const obj2 = { email: 'chantouchsek.cs83@gmail.com' }
    const merged = { email: 'chantouchsek.cs83@gmail.com', name: 'Chantouch' }
    expect(merge(obj1, obj2)).toEqual(merged)
  })
})
