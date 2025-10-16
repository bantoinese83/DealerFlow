import { describe, it, expect } from 'vitest'

describe('native array behavior (sanity checks)', () => {
  it('should map values', () => {
    expect([1,2,3].map(x => x * 2)).toEqual([2,4,6])
  })

  it('should filter values', () => {
    expect([1,2,3,4,5].filter(x => x % 2 === 0)).toEqual([2,4])
  })

  it('should reduce values', () => {
    expect([1,2,3,4,5].reduce((a,b) => a + b, 0)).toBe(15)
  })
})
