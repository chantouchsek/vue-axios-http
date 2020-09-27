// clone of sindresorhus/matcher
'use strict'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import escapeStringRegexp from 'escape-string-regexp'

const reCache = new Map()

function makeRe(pattern: any, options: any) {
  const opts = Object.assign(
    {
      caseSensitive: false,
    },
    options,
  )

  const cacheKey = pattern + JSON.stringify(opts)

  if (reCache.has(cacheKey)) {
    return reCache.get(cacheKey)
  }

  const negated = pattern[0] === '!'

  if (negated) {
    pattern = pattern.slice(1)
  }

  pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*')

  const re = new RegExp(`^${pattern}$`, opts.caseSensitive ? '' : 'i')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  re.negated = negated
  reCache.set(cacheKey, re)

  return re
}

export const isMatch = (input: any, pattern?: any, options?: any) => {
  const re = makeRe(pattern, options)
  const matches = re.test(input)
  return re.negated ? !matches : matches
}
