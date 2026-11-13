import { describe, expect, it } from 'vitest'
import { getPagination } from '../pagination'

describe('pagination', () => {
  it('returns all pages when totalPage is 3 or less', () => {
    expect(getPagination(1, 1)).toEqual([1])
    expect(getPagination(1, 2)).toEqual([1, 2])
    expect(getPagination(2, 3)).toEqual([1, 2, 3])
  })

  it('handles pagination near the beginning', () => {
    const pages = getPagination(1, 10)
    expect(pages).toEqual([1, 2, 3, '...', 10])
  })

  it('handles pagination in the middle', () => {
    const pages = getPagination(5, 10)
    expect(pages).toEqual([1, '...', 4, 5, 6, '...', 10])
  })

  it('handles pagination near the end', () => {
    const pages = getPagination(9, 10)
    expect(pages).toEqual([1, '...', 8, 9, 10])
  })
})
