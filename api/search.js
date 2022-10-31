import request from '@/utils/request';

// 获取分页数据
export function getPagination(query) {
    return request({
        url: '/search/pagination',
        method: 'get',
        params: query
    });
}