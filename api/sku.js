import request from '@/utils/request';

export function getDetail(id) {
    return request({
        url: `/sku/detail/${id}`,
        method: 'get'
    });
}