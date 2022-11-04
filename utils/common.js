// 取交集
export function getIntersection(s1, s2) {
    const result = [];
    for (const s1Item of s1) {
        const index = s2.findIndex(s2Item => s2Item === s1Item);
        if (index !== -1) {
            result.push(s1Item);
        }
    }
    return result;
}

export function timeout(delay) {
    return new Promise(resolve => {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            resolve()
        }, delay * 1000)
    })
}