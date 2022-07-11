export default function promiseLimit(promises, limit) {
    return new Promise(resolve => {
        let resolvedCount = 0;
        let count = 0;
        let res:any[] = [];
        const len = promises.length;

        function next(p, index) {
            p.then(r => {
                res[index] = r;
                // 记录请求成功的数量
                resolvedCount++
                // 数组还存在为执行的promise
                if (promises.length) {
                    const p = promises.shift()
                    next(p, count)
                    count++
                } else if (resolvedCount === len) {
                    resolve(res)
                }
            })
        }
        // 1. 设置最开始的并发请求为最大值或全部promise数组
        while (count < limit && promises.length) {
            const p = promises.shift()
            next(p, count)
            count++
        }
    })
}