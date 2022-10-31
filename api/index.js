import request from '@/utils/request';

// 获取index页面数据
export function getAggregation() {
    return request({
        url: '/aggregation',
        method: 'get'
    });
}