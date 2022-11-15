<template>
    <div>
        <NavHeader :searchBarVisible="false" />

        <div class="container" style="min-height: 500px; margin-top: 100px;">
            <div style="text-align: center; font-size: 20px;">订单号：{{orderSn}}</div>
            <div v-if="!detail.id">
                没有获取到订单的数据
            </div>
            <el-result v-else-if="detail.payType !== 0" icon="success" title="支付成功" subTitle="谢谢~">
                <template slot="extra">
                    <NuxtLink to="/">继续购物</NuxtLink>
                    <NuxtLink to="/">我的订单</NuxtLink>
                </template>
            </el-result>
            <el-result v-else icon="error" title="支付失败" subTitle="非常抱歉，如有问题，请联系客服">
                <template slot="extra">
                    <NuxtLink to="/">返回</NuxtLink>
                </template>
            </el-result>
        </div>
        <NavFooter />
    </div>
    
</template>
<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import request from '@/utils/request';

export default {
    layout: 'layout-1',
    components: {
        NavHeader, NavFooter
    },
    data() {
        return {
            detail: {},
            orderSn: ""
        };
    },
    created() {

        const { out_trade_no } = this.$route.query;
        this.orderSn = out_trade_no;
        this.getOrderDetail();
    },
    methods: {
        async getOrderDetail() {
            const resp = await request({
                url: '/order/brief',
                params: {
                    orderSn: this.orderSn
                },
                method: 'get'
            });

            if (resp.code !== 0) {
                return this.$message.warning("获取数据失败");
            }
            this.detail = resp.data;
        }
    },
};
</script>