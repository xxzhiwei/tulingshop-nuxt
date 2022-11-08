<template>
    <div class="cart">
        <order-header title="我的购物车" :logoVisible="false" style="padding-top: 0;" :usernameVisible="false">
            <template v-slot:tip>
                <span>温馨提示：产品是否购买成功，以最终下单为准，请尽快结算</span>
            </template>
        </order-header>
        <div class="wrapper">
            <div class="container">
                <div class="cart-box">
                    <el-row style="line-height: 80px;">
                        <el-col :span="2">
                            <el-checkbox class="x-checkbox" v-model="allChecked" size="medium">全选</el-checkbox>
                        </el-col>
                        <el-col :span="9">
                            <li>商品名称</li>
                        </el-col>
                        <el-col :span="3">
                            <li>单价</li>
                        </el-col>
                        <el-col :span="5">
                            <li>数量</li>
                        </el-col>
                        <el-col :span="3">
                            <li>小计</li>
                        </el-col>
                        <el-col :span="2">
                            <div>操作</div>
                        </el-col>
                    </el-row>
                    <ul>
                        <li v-for="(item, index) in detail.items" v-bind:key="index">
                            <el-row style="line-height: 40px;">
                                <el-col :span="2">
                                    <el-checkbox class="x-checkbox" size="medium" v-model="item.checked"></el-checkbox>
                                </el-col>
                                <el-col :span="9">
                                    <img style="height: 40px; width: 40px; vertical-align: middle;" v-lazy="item.productPic" alt="">
                                    <span>{{item.title}}</span>
                                </el-col>
                                <el-col :span="3">
                                    <div>{{item.price}}</div>
                                </el-col>
                                <el-col :span="5">
                                    <el-input-number size="small" v-model="item.count" @change="handleCountChange" :min="1"></el-input-number>
                                    <div style="font-size: 12px;">当前库存：{{item.stock || 0}}</div>
                                </el-col>
                                <el-col :span="3">
                                    <div>{{detail.amount}}</div>
                                </el-col>
                                 <el-col :span="2">
                                    <i class="el-icon-close"></i>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </div>
                <div class="order-wrap clearfix">
                    <div class="cart-tip fl">
                        <a href="/#/index">继续购物</a>
                        共<span>{{detail.count}}</span>件商品，已选择<span>{{countChecked}}</span>件，总价<span>{{amount}}</span>
                    </div>
                    <div class="total fr">
                        <a href="javascript:;" class="btn">去结算</a>
                    </div>
                </div>
            </div>
        </div>
        <service-bar></service-bar>
    </div>
</template>
<script>
import OrderHeader from "@/components/OrderHeader";
import ServiceBar from "@/components/ServiceBar";
import { getDetail, updateCount, remove } from "@/api/cart";
import { purchase } from "@/api/order";

export default {
    // layout: "layout-1",
    components: {
        OrderHeader,
        ServiceBar,
    },
    async asyncData({ store }) {
        const resp = await getDetail({ store });
        
        const obj = {
            detail: {
                items: [],
                amount: 0,
                count: 0
            },
            allChecked: false, //是否全选
        };
        if (resp && resp.code === 0) {
            for (const item of resp.data.items) {
                item.checked = false;
            }
            obj.detail = resp.data;
        }
        return obj;
    },
    computed: {
        itemChecked() {
            return this.detail.items.filter(item => item.checked);
        },
        countChecked() {
            let count = 0;
            for (const item of this.itemChecked) {
                count += item.count;
            }
            return count;
        },
        // 价格前端自己计算，只用于展示【元，保留两位小数】
        amount() {
            let amount = 0;
            for (const item of this.itemChecked) {
                amount += item.count * (item.price * 100);
            }
            
            return amount / 100;
        }
    },
    methods: {
        handleCountChange(...items) {
            console.log(items);
        },
        // 更新商品数量
        async updateCount() {
            // const resp = await updateCount();
        },

        // 移除商品
        async remove() {
            // const resp = await remove();
        },

        // 下单
        async purchase() {
            // const resp = await purchase();
        }
    },
};
</script>
<style lang="scss">
.cart {
    .x-checkbox {
        .el-checkbox__inner {
            border-color: #FF6600;
        }
        &.is-checked {
            .el-checkbox__label {
                color: #606266;
            }
            .el-checkbox__inner {
                border-color: #FF6600;
                background-color: #FF6600;
            }
        }
    }
    .wrapper {
        background-color: #f5f5f5;
        padding-top: 30px;
        padding-bottom: 114px;
        .cart-box {
            background-color: #fff;
            font-size: 14px;
            color: #999999;
            text-align: center;
            .checkbox {
                display: inline-block;
                width: 22px;
                height: 22px;
                border: 1px solid #e5e5e5;
                vertical-align: middle;
                margin-right: 17px;
                cursor: pointer;
                &.checked {
                    background: url("/imgs/icon-gou.png") #ff6600 no-repeat
                        center;
                    background-size: 16px 12px;
                    border: none;
                }
            }
        }
        .order-wrap {
            font-size: 14px;
            color: #666666;
            margin-top: 20px;
            height: 50px;
            line-height: 50px;
            .cart-tip {
                margin-left: 29px;
                a {
                    color: #666666;
                    margin-right: 37px;
                }
                span {
                    color: #ff6600;
                    margin: 0 5px;
                }
            }
            .total {
                font-size: 14px;
                color: #ff6600;
                span {
                    font-size: 24px;
                }
                a {
                    width: 202px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 18px;
                    margin-left: 37px;
                }
            }
        }
    }
}
</style>