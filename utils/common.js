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

// 解析服务端cookies
export function parseCookies(str) {

    const r = {};
    if (!str) {
        return r;
    }

    for (const item of str.split(";")) {
        const arr = item.split("=");
        r[arr[0].trim()] = arr[1].trim();
    }

    return r;
}

// 格式化通过cookie传输的字符串【「"」被转为%22，「,」被转为%2C】
export function parseJson(jsonStr) {
    return jsonStr.replace(/%22|%2C/g, function (item) {
        const map = {
            '%22': '"',
            '%2C': ','
        };
        return map[item];
    });
}