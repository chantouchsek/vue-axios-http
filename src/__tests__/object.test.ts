import { isFile, cloneDeep } from '../util'

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
})
