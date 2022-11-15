<template>
    <div style="min-height: 400px;">
        <div ref="content" v-html="content"></div>
    </div>
</template>
<script>

import request from '@/utils/request';

// 1、若订单未支付，则请求支付；
// 2、已支付，则显示报错信息；
export default {
    async asyncData({ query, store, error }) {
        const orderSn = query.orderSn;
        const resp = await request({
            url: '/payment/alipay',
            method: 'post',
            data: {
                orderSn
            },
            store
        });

        if (resp.code !== 0) {
            error(resp);
        }
        return {
            orderSn,
            content: resp.data
        };
    },

    mounted() {
        // 跳转至支付宝收银台
        this.$refs.content.children[0].submit();
    },
    methods: {
    },
};
</script>