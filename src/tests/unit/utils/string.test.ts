import { describe, it, expect } from 'vitest'
// No string utils module present; test existing helpers instead
import { truncateText, generateId } from '@/common/utils'

describe('string helpers (existing)', () => {
  it('should truncate text with ellipsis when exceeding max length', () => {
    expect(truncateText('hello world', 5)).toBe('hello...')
    expect(truncateText('hello', 10)).toBe('hello')
  })

  it('should generate an id string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})
