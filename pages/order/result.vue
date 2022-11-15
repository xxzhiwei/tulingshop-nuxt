<template>
    <div class="order-pay">
        <order-header title="支付订单" :logoVisible="false" style="padding-top: 0;" :usernameVisible="false">
            <template v-slot:tip>
                <span>请谨防钓鱼链接或诈骗电话，了解更多</span>
            </template>
        </order-header>
        <div class="wrapper">
            <div class="container">
                <div class="order-wrap">
                    <div class="item-order">
                        <div class="icon-succ"></div>
                        <div class="order-info">
                            <h2>订单提交成功！</h2>
                            <p>请在<span>120分</span>内完成支付, 超时后将取消订单</p>
                            <p>收货信息：{{detail.receiverProvince}} {{detail.receiverCity}} {{detail.receiverRegion}} {{detail.detailAddress}} {{detail.receiverPhone}} {{detail.receiverName}}</p>
                        </div>
                        <div class="order-total">
                            <p>应付总额：<span>{{detail.totalAmount}}</span>元</p>
                            <p @click="detailed = !detailed">订单详情<em :class="detailed ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></em></p>
                        </div>
                    </div>
                    <div class="item-detail" v-if="detailed">
                        <div class="item">
                            <div class="detail-title">订单号：</div>
                            <div class="detail-info theme-color">{{detail.orderSn}}</div>
                        </div>
                        <div class="item">
                            <div class="detail-title">收货地址：</div>
                            <div class="detail-info">{{detail.receiverProvince}} {{detail.receiverCity}} {{detail.receiverRegion}} {{detail.receiverDetailAddress}}</div>
                        </div>
                        <div class="item">
                            <div class="detail-title">收货人：</div>
                            <div class="detail-info">{{detail.receiverPhone}} {{detail.receiverName}}</div>
                        </div>
                        <div class="item good">
                            <div class="detail-title">商品名称：</div>
                            <div class="detail-info">
                                <ul>
                                    <li v-for="(item) in detail.items" :key="item.id">
                                        <i class="el-icon-picture-outline" style="margin-right: 5px;"></i> {{item.productName}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-pay">
                    <h3>选择以下支付方式付款</h3>
                    <div class="pay-way">
                        <p>支付平台</p>
                        <div class="pay pay-ali" @click="handleAlipayClick"></div>
                        <!-- <div class="pay pay-wechat"></div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import OrderHeader from "@/components/OrderHeader";
import { getDetail } from "@/api/order";

export default {
    async asyncData({ query, store, error }) {
        const { orderSn } = query;

        // 获取订单信息
        const resp = await getDetail({
            params: {
                orderSn: orderSn
            },
            store
        });
        if (resp.code !== 0) {
            // throw new Error("获取数据失败");
            error(resp);
        }
        return {
            paymentType: 1,
            detail: resp.data,
            detailed: false
        };
    },
    components: {
        OrderHeader,
    },
    mounted() {
    },
    methods: {
        handleAlipayClick() {
            this.$router.push({
                path: '/payment/alipay',
                query: {
                    orderSn: this.$route.query.orderSn
                }
            });
        },
    },
};
</script>
<style lang="scss">
.order-pay {
    .wrapper {
        background-color: #f5f5f5;
        padding-top: 30px;
        padding-bottom: 61px;
        .order-wrap {
            padding: 62px 50px;
            background-color: #fff;
            font-size: 14px;
            margin-bottom: 30px;
            .item-order {
                display: flex;
                align-items: center;
                .icon-succ {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    background: url("/imgs/icon-gou.png") #80c58a no-repeat
                        center;
                    background-size: 60px;
                    margin-right: 40px;
                }
                .order-info {
                    flex: 3;
                    // margin-right: 248px;
                    h2 {
                        font-size: 24px;
                        color: #333333;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666666;
                        span {
                            color: #ff6700;
                        }
                    }
                }
                .order-total {
                    flex: 3;
                    & > p:first-child {
                        margin-bottom: 30px;
                    }
                    span {
                        font-size: 28px;
                        color: #ff6700;
                    }
                    .icon-down {
                        display: inline-block;
                        width: 14px;
                        height: 10px;
                        background: url("/imgs/icon-down.png") no-repeat center;
                        background-size: contain;
                        margin-left: 9px;
                        transition: all 0.5s;
                        cursor: pointer;
                        &.up {
                            transform: rotate(180deg);
                        }
                    }
                    .icon-up {
                        transform: rotate(180deg);
                    }
                }
            }
            .item-detail {
                border-top: 1px solid #d7d7d7;
                padding-top: 47px;
                padding-left: 130px;
                font-size: 14px;
                margin-top: 45px;
                .item {
                    margin-bottom: 19px;
                    .detail-title {
                        float: left;
                        width: 100px;
                    }
                    .detail-info {
                        display: inline-block;
                        img {
                            width: 30px;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
        .item-pay {
            padding: 26px 50px 72px;
            background-color: #ffffff;
            color: #333333;
            h3 {
                font-size: 20px;
                font-weight: 200;
                color: #333333;
                padding-bottom: 24px;
                border-bottom: 1px solid #d7d7d7;
                margin-bottom: 26px;
            }
            .pay-way {
                font-size: 18px;
                .pay {
                    display: inline-block;
                    width: 188px;
                    height: 64px;
                    border: 1px solid #d7d7d7;
                    cursor: pointer;
                    &:last-child {
                        margin-left: 20px;
                    }
                    &.checked {
                        border: 1px solid #ff6700;
                    }
                }
                .pay-ali {
                    background: url("/imgs/pay/icon-ali.png") no-repeat center;
                    background-size: 103px 38px;
                    margin-top: 19px;
                }
                .pay-wechat {
                    background: url("/imgs/pay/icon-wechat.png") no-repeat
                        center;
                    background-size: 103px 38px;
                }
            }
        }
    }
}
</style>