import promiseLimit from '../../src/utils/promiseLimit'
describe('promise limit', () => {
    it('controls promise count', () => {
        const p: any[] = []
        for (let i = 0; i < 20; i++) {
            p.push(new Promise(resolve => resolve))
        }
        expect(promiseLimit(p, 4)).resolves.toBe([])
    })
})