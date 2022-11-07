import request from '@/utils/request';

export function login(data) {
    return request({
        url: '/member/login',
        method: 'post',
        data
    });
}

export async function refresh(data) {
    return await request({
        url: '/member/refresh',
        method: 'post',
        data
    });
}

export function logout() {
    return request({
        url: '/member/logout',
        method: 'post'
    });
}

export function register(params) {
    return request({
        url: '/member/register',
        method: 'post',
        data: params
    });
}

export function getDetail() {
    return request({
        url: '/member/detail',
        method: 'get'
    });
}