import request from '@/utils/request';

/**
 * 将商品加入购物车
 * @param {Object} params {skuId, count}
 * @returns 
 */
export function add(params) {
    return request({
        url: '/cart/item/add',
        method: 'post',
        data: params
    });
}

// 更新购物车商品
export function updateCount(params) {
    return request({
        url: '/cart/item/updateCount',
        method: 'post',
        data: params
    });
}

// 移除购物车商品
export function remove(params) {
    return request({
        url: '/cart/item/remove',
        method: 'post',
        data: params
    });
}

// 清空购物车
export function clear() {
    return request({
        url: '/cart/clear',
        method: 'post'
    });
}

// 获取购物车详情【非客户端调用的接口，需要手动传递store；这是目前的处理手段
export function getDetail(params) {
    return request({
        url: '/cart/detail',
        method: 'get',
        store: params.store
    });
}