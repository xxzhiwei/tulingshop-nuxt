<template>
    <div class="order-confirm">
        <order-header title="订单确认" :logoVisible="false" style="padding-top: 0;" :usernameVisible="false">
            <template v-slot:tip>
                <span>请填写收货地址</span>
            </template>
        </order-header>
        <!-- <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0px; height: 0px; overflow: hidden">
            <defs>
                <symbol id="icon-add" viewBox="0 0 31 32">
                    <title>add</title>
                    <path d="M30.745 15.152h-14.382v-14.596c0-0.308-0.243-0.557-0.543-0.557s-0.543 0.249-0.543 0.557v14.596h-14.665c-0.3 0-0.543 0.249-0.543 0.557s0.243 0.557 0.543 0.557h14.665v15.177c0 0.307 0.243 0.557 0.543 0.557s0.543-0.249 0.543-0.557v-15.177h14.382c0.3 0 0.543-0.249 0.543-0.557s-0.243-0.557-0.543-0.557z" class="path1"></path>
                </symbol>
                <symbol id="icon-edit" viewBox="0 0 32 32">
                    <title>edit</title>
                    <path d="M28.287 8.51l-4.805-4.806 0.831-0.831c0.472-0.472 1.086-0.777 1.564-0.777 0.248 0 0.452 0.082 0.622 0.253l3.143 3.144c0.539 0.54 0.133 1.529-0.524 2.186l-0.831 0.831zM26.805 9.992l-1.138 1.138-4.805-4.806 1.138-1.138 4.805 4.806zM24.186 12.612l-14.758 14.762-4.805-4.806 14.758-14.762 4.805 4.806zM7.379 28.288l-4.892 1.224 1.223-4.894 3.669 3.67zM31.123 4.011l-3.143-3.144c-0.567-0.567-1.294-0.867-2.103-0.867-1.036 0-2.174 0.52-3.045 1.391l-20.429 20.436c-0.135 0.134-0.23 0.302-0.276 0.487l-2.095 8.385c-0.089 0.355 0.017 0.736 0.276 0.995 0.198 0.198 0.461 0.307 0.741 0.307 0.085 0 0.171-0.010 0.254-0.031l8.381-2.096c0.185-0.047 0.354-0.142 0.487-0.276l20.43-20.436c1.409-1.41 2.042-3.632 0.524-5.15v0z" class="path1"></path>
                </symbol>
                <symbol id="icon-del" viewBox="0 0 32 32">
                    <title>delete</title>
                    <path d="M11.355 4.129v-2.065h9.29v2.065h-9.29zM6.194 29.935v-23.742h19.613v23.742h-19.613zM30.968 4.129h-8.258v-3.097c0-0.569-0.463-1.032-1.032-1.032h-11.355c-0.569 0-1.032 0.463-1.032 1.032v3.097h-8.258c-0.569 0-1.032 0.463-1.032 1.032s0.463 1.032 1.032 1.032h3.097v24.774c0 0.569 0.463 1.032 1.032 1.032h21.677c0.569 0 1.032-0.463 1.032-1.032v-24.774h3.097c0.569 0 1.032-0.463 1.032-1.032s-0.463-1.032-1.032-1.032v0z" class="path1"></path>
                    <path d="M10.323 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z" class="path2"></path>
                    <path d="M16 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z" class="path3"></path>
                    <path d="M21.677 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z" class="path4"></path>
                </symbol>
            </defs>
        </svg> -->
        <div class="wrapper">
            <div class="container">
                <div class="order-box">
                    <div class="item-address">
                        <h2 class="addr-title">收货地址</h2>
                        <div class="addr-list clearfix">
                            <div class="addr-info" :class="{ checked: index == checkIndex }" @click="checkIndex = index" v-for="(item, index) in deliveries" :key="index">
                                <h2>{{ item.name }}</h2>
                                <div class="phone">{{ item.phoneNumber }}</div>
                                <div class="street">
                                    {{item.province}} {{item.city}} {{item.region}} {{item.detailAddress}}
                                </div>
                                <div class="action">
                                    actions
                                    <!-- <a href="javascript:;" class="fl">
                                        <svg class="icon icon-del">
                                            <use xlink:href="#icon-del"></use>
                                        </svg>
                                    </a>
                                    <a href="javascript:;" class="fr">
                                        <svg class="icon icon-edit">
                                            <use xlink:href="#icon-edit"></use>
                                        </svg>
                                    </a> -->
                                </div>
                            </div>
                            <div class="addr-add" @click="addressDialogVisible = true">
                                <div class="icon-add"></div>
                                <div>添加新地址</div>
                            </div>
                        </div>
                    </div>
                    <div class="item-good">
                        <h2>商品</h2>
                        <!-- <ul>
                            <li v-for="(item, index) in cartList" :key="index">
                                <div class="good-name">
                                    <img v-lazy="item.productPic" alt="" />
                                    <span>123</span>
                                </div>
                                <div class="good-price">
                                    123
                                </div>
                                <div class="good-total">123元</div>
                            </li>
                        </ul> -->
                    </div>
                    <div class="detail">
                        <div class="item">
                            <span class="item-name">商品件数：</span>
                            <span class="item-val">0件</span>
                        </div>
                        <div class="item">
                            <span class="item-name">商品总价：</span>
                            <span class="item-val">0元</span>
                        </div>
                        <div class="item">
                            <span class="item-name">运费：</span>
                            <span class="item-val">0元</span>
                        </div>
                        <div class="item-total">
                            <span class="item-name">应付总额：</span>
                            <span class="item-val">0元</span>
                        </div>
                    </div>
                    <div class="btn-group">
                        <a href="/cart" class="btn btn-default btn-large">返回购物车</a>
                        <a href="javascript:;" class="btn btn-large">提交订单</a>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog class="x-dialog-1" title="新增收货方式" :visible.sync="addressDialogVisible" width="35%">

            <el-form ref="form" :model="deliveryFormData" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="deliveryFormData.username"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="deliveryFormData.phone"></el-input>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        v-model="deliveryFormData.regionStr"
                        :options="regions">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="deliveryFormData.address" type="textarea" :rows="2"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button type="primary" class="x-button-1" style="border-radius: 0" @click="addressDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import OrderHeader from "@/components/OrderHeader";
export default {
    name: "order-confirm",
    data() {
        return {
            checkIndex: 0, //当前收货地址选中索引
            addressDialogVisible: false,
            deliveryFormData: {
                username: "",
                phone: "",
                regionStr: ""
            },
            regions: [],
            deliveries: []
        };
    },
    computed: {},
    components: {
        OrderHeader,
    },
    mounted() {
        const regions = require("@/api/region2.json");
        console.log(regions);
        // this.regions = regions;
    },

    methods: {},
};
</script>
<style lang="scss">
@import "@/assets/scss/el-ui-cover.scss";
.order-confirm {
    .wrapper {
        background-color: #f5f5f5;
        padding-top: 30px;
        padding-bottom: 84px;
        .order-box {
            background-color: #ffffff;
            padding-left: 40px;
            padding-bottom: 40px;
            .addr-title {
                font-size: 20px;
                color: #333333;
                font-weight: 200;
                margin-bottom: 21px;
            }
            .item-address {
                padding-top: 38px;
                .addr-list {
                    .addr-info,
                    .addr-add {
                        box-sizing: border-box;
                        float: left;
                        width: 271px;
                        height: 180px;
                        border: 1px solid #e5e5e5;
                        margin-right: 15px;
                        padding: 15px 24px;
                        font-size: 14px;
                        color: #757575;
                    }
                    .addr-info {
                        cursor: pointer;
                        h2 {
                            height: 27px;
                            font-size: 18px;
                            font-weight: 300;
                            color: #333;
                            margin-bottom: 10px;
                        }
                        .street {
                            height: 50px;
                        }
                        .action {
                            height: 50px;
                            line-height: 50px;
                            .icon {
                                width: 20px;
                                height: 20px;
                                fill: #666666;
                                vertical-align: middle;
                                &:hover {
                                    fill: #ff6700;
                                }
                            }
                        }
                        &.checked {
                            border: 1px solid #ff6700;
                        }
                    }
                    .addr-add {
                        text-align: center;
                        color: #999999;
                        cursor: pointer;
                        .icon-add {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            background: url("/imgs/icon-add.png") #e0e0e0
                                no-repeat center;
                            background-size: 14px;
                            margin: 0 auto;
                            margin-top: 45px;
                            margin-bottom: 10px;
                        }
                    }
                }
            }
            .item-good {
                margin-top: 34px;
                border-bottom: 1px solid #e5e5e5;
                padding-bottom: 12px;
                h2 {
                    border-bottom: 1px solid #e5e5e5;
                    padding-bottom: 5px;
                }
                li {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    line-height: 40px;
                    margin-top: 10px;
                    font-size: 16px;
                    color: #333333;
                    .good-name {
                        flex: 5;
                        img {
                            width: 30px;
                            height: 30px;
                            vertical-align: middle;
                        }
                    }
                    .good-price {
                        flex: 2;
                    }
                    .good-total {
                        padding-right: 44px;
                        color: #ff6600;
                    }
                }
            }
            .item-shipping,
            .item-invoice {
                margin-top: 31px;
                line-height: 20px;
                h2 {
                    display: inline-block;
                    margin-right: 71px;
                    font-size: 20px;
                    width: 80px;
                }
                span,
                a {
                    font-size: 16px;
                    color: #ff6700;
                    margin-right: 23px;
                }
            }
            .detail {
                padding: 50px 44px 33px 0;
                border-bottom: 1px solid #f5f5f5;
                text-align: right;
                font-size: 16px;
                color: #666666;
                .item-val {
                    color: #ff6700;
                }
                .item {
                    line-height: 15px;
                    margin-bottom: 12px;
                }
                .item-val {
                    display: inline-block;
                    width: 100px;
                }
                .item-total {
                    .item-val {
                        font-size: 28px;
                    }
                }
                .selc {
                    border: 1px solid #ccc;
                    padding: 7px 7px;
                    border-radius: 3px;
                    padding-left: 5px;
                    padding-bottom: 10px;
                    font-size: 24;
                    margin-bottom: 12px;
                }
            }
            .btn-group {
                margin-top: 37px;
                text-align: right;
            }
        }
    }
    .edit-wrap {
        font-size: 14px;
        .item {
            margin-bottom: 15px;
            .inline-input {
                width: 100%;
            }
            .input {
                display: inline-block;
                width: 283px;
                height: 40px;
                line-height: 40px;
                padding-left: 15px;
                border: 1px solid #e5e5e5;
                & + .input {
                    margin-left: 14px;
                }
            }
            select {
                height: 40px;
                line-height: 40px;
                border: 1px solid #e5e5e5;
                margin-right: 15px;
            }
            textarea {
                height: 62px;
                width: 100%;
                padding: 13px 15px;
                box-sizing: border-box;
                border: 1px solid #e5e5e5;
            }
        }
    }
}
</style>