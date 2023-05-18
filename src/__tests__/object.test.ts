import { hasFiles, isFile } from '../util'

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
  it('check if window is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window
    const file = new File(['hello world!'], 'myfile')
    const form = new FormData()
    form.append('file', file)
    expect(hasFiles(form)).toBeFalsy()
  })
  /*
  it('check if File is not function', () => {
    const file = new File(['hello world!'], 'myfile')
    delete global.File
    expect(isFile(file)).toBeFalsy()
  })
  */
})
