import type { ValidatorType } from '../core/Validator'
import Validator from '../core/Validator'

describe('Validator', () => {
  let validator: ValidatorType
  beforeEach(() => {
    validator = Validator
    validator.flush()
  })
  afterEach(() => {
    validator.flush()
  })
  test('Add an error', () => {
    validator.add('name', 'The name field is required.')
    expect(validator.any()).toBeTruthy()
  })
  test('add error with missed attribute', () => {
    validator.add('name-3diidi', 'The name field is required.')
    expect(validator.any()).toBeTruthy()
  })
  test('Add an error message as string', () => {
    const errors = {
      name: 'The name field is required.',
    }
    validator.fill(errors)
    expect(validator.any()).toBeTruthy()
    expect(validator.first('name')).toEqual('The name field is required.')
  })
  test('Check if error has "name" key.', () => {
    validator.add('name', 'The name field is required.')
    expect(validator.has('name')).toBeTruthy()
    expect(validator.first(['name', 'form.name'])).toBe(
      'The name field is required.',
    )
  })
  test('Check if has error by multi key', () => {
    validator.add('name', 'The name field is required.')
    validator.add('email', 'The email field is required.')
    expect(validator.has(['name', 'email'])).toBeTruthy()
    expect(validator.first('name')).toBe('The name field is required.')
  })
  test('Check if error has no "name" key', () => {
    validator.add('email', 'The email field is required.')
    expect(validator.missed('name')).toBeTruthy()
    expect(validator.nullState('name')).toBeNull()
  })
  test('Check nullState function', () => {
    validator.add('email', 'The email field is required.')
    expect(validator.nullState('email')).toBeFalsy()
  })
  test('Get an none exist error messages by param name', () => {
    expect(validator.get('email')).toHaveLength(0)
  })
  test('Get all errors by key', () => {
    validator.add('email', 'The email field is required.')
    expect(validator.get('email').length).toBeGreaterThan(0)
  })
  test('Get all errors by keys', () => {
    validator.add('email', 'The email field is required.')
    validator.add('form.email', 'The form.name field is required.')
    expect(validator.first(['name', 'form.email'])).toBeDefined()
  })
  test('Get all errors message', () => {
    validator.add('email', 'The email field is required.')
    validator.add('name', 'The name field is required.')
    expect(Object.keys(validator.all()).length).toBeGreaterThan(0)
  })
  test('Fill errors', () => {
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    expect(validator.first('name')).toBe('The name field is required.')
    expect(validator.first('email')).toBe('The email field is required.')
    expect(Object.keys(validator.all()).length).toEqual(2)
  })
  it('should not allow protopath overwrite', () => {
    const errors = {
      __proto__: ['Set __proto__ to overwrite.'],
    }
    validator.fill(errors)
    expect(Object.keys(validator.all()).length).toEqual(0)
  })
  test('Clear all errors by flush', () => {
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.flush()
    expect(Object.keys(validator.all()).length).toEqual(0)
  })
  test('Clear all errors by clear', () => {
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.clear()
    expect(Object.keys(validator.all()).length).toEqual(0)
  })
  test('Clear all errors by key', () => {
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.clear('name')
    expect(validator.has('name')).toBeFalsy()
  })
  test('Check if there is no any errors', () => {
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.clear(['name', 'email'])
    expect(validator.isValid()).toBeTruthy()
  })
  test('onkeydown event', () => {
    const event = {
      target: { name: 'name' },
    }
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.onKeydown(event)
    expect(validator.has('name')).toBeFalsy()
  })
  test('onkeydown event with name undefined', () => {
    const event = {
      target: { name: undefined },
    }
    const errors = {
      name: ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.onKeydown(event)
    expect(validator.has('name')).toBeTruthy()
  })
  test('onkeydown event with prefix', () => {
    const event = {
      target: { name: 'name' },
    }
    const errors = {
      'form.name': ['The name field is required.'],
      email: ['The email field is required.'],
    }
    validator.fill(errors)
    validator.onKeydown(event, 'form')
    expect(validator.has(['form.name', 'name'])).toBeFalsy()
  })

  it('can pass array of keys to any method and get back error of specified key', () => {
    const errors = {
      first_name: ['This field is required'],
      last_name: ['This field is required'],
      age: ['This field is required'],
    }
    validator.fill(errors)

    expect(validator.any(['first_name', 'last_name'], true)).toEqual({
      first_name: ['This field is required'],
      last_name: ['This field is required'],
    })
  })

  it('should return empty object, with returnObject property is true', () => {
    const errors = {
      first_name: ['This field is required'],
      last_name: ['This field is required'],
      age: ['This field is required'],
    }
    validator.fill(errors)
    expect(validator.any([], true)).toEqual({})
  })

  it('can pass array of keys to any method and get back boolean', () => {
    const errors = {
      first_name: ['This field is required'],
      last_name: ['This field is required'],
      age: ['This field is required'],
    }
    validator.fill(errors)

    expect(validator.any(['first_name', 'last_name'], false)).toBeTruthy()
  })

  it('get first by field', () => {
    const errors = {
      first_name: ['This first name field is required'],
      last_name: ['This last name field is required'],
      age: ['This age field is required'],
    }

    expect(validator.firstBy(errors, 'age')).toEqual(
      'This age field is required',
    )
  })

  it('get first by without any field', () => {
    const errors = {
      first_name: ['This fist name field is required'],
      last_name: ['This last name field is required'],
      age: ['This age field is required'],
    }

    expect(validator.firstBy(errors)).toEqual(
      'This fist name field is required',
    )
  })

  it('get first array by nested array', () => {
    const errors = { name: [{ kh: ['This fist name field is required'] }] }
    validator.fill(errors)

    expect(validator.first(['name[0]'])).toEqual(errors.name[0])
  })

  it('get first by nested array', () => {
    const errors = { name: [{ kh: ['This fist name field is required'] }] }
    validator.fill(errors)

    expect(validator.first(['name[0].kh'])).toEqual(
      'This fist name field is required',
    )
  })
})
