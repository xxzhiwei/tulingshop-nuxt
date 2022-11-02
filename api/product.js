import request from '@/utils/request';

export function getDetail(id) {
    return request({
        url: `/product/detail/${id}`,
        method: 'get'
    });
}