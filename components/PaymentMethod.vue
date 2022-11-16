<template>
    <div>
        <div style="display: inline-block; cursor: pointer;" @click="handleAlipayClick">
            <img style="width: 130px;" :src="alipay" alt="">
        </div>
    </div>
</template>

<script>
const alipay = require("@/assets/alipay1.png"); 

export default {
    props: {
        orderSn: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            alipay
        }
    },
    methods: {
        handleAlipayClick() {
            this.$router.push({
                path: '/payment/alipay',
                query: {
                    orderSn: this.orderSn
                }
            });
        },
    }
};
</script>

<style>
</style>