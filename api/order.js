import request from '@/utils/request';

// 下单
export function create(params) {
    return request({
        url: '/order/create',
        method: 'post',
        data: params
    });
}

export function getDetail(params) {
    return request({
        url: '/order/detail',
        method: 'get',
        ...params
    });
}

export function getPagination(params) {
    return request({
        url: '/order/pagination',
        method: 'get',
        params
    });
}