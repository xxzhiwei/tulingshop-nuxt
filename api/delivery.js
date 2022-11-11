import request from '@/utils/request';

// 获取收货地址列表
export function getList() {
    return request({
        url: `/delivery/list`,
        method: 'get'
    });
}

export function save(params) {
    return request({
        url: `/delivery/save`,
        method: 'post',
        data: params
    });
}

export function del(params) {
    return request({
        url: `/delivery/del`,
        method: 'post',
        data: params
    });
}

export function update(params) {
    return request({
        url: `/delivery/update`,
        method: 'post',
        data: params
    });
}

export function setDefault(params) {
    return request({
        url: `/delivery/setDefault`,
        method: 'post',
        data: params
    });
}