import request from '@/utils/request';

// 下单
export function purchase(params) {
    return request({
        url: '/order/purchase',
        method: 'post',
        data: params
    });
}