import { assert, describe, expect, it } from 'vitest'

describe('promise limit ', () => {
  it('test', () => {
    assert.equal(3,3)
  })
  it('snapshot', () => {
    const text = 'whatever'
    expect(text).toMatchSnapshot()
  })
})