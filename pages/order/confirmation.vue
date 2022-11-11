<template>
    <div class="order-confirm">
        <order-header title="订单确认" :logoVisible="false" style="padding-top: 0;" :usernameVisible="false">
            <template v-slot:tip>
                <span>请填写收货地址</span>
            </template>
        </order-header>
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
                        :options="regions" :props="regionProps">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="deliveryFormData.address" type="textarea" :rows="2"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button type="primary" class="x-button-1" style="border-radius: 0" @click="test1">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
// 这个确认界面，最好是在购物车处，不然参数怎么传？【由于数据没有涉及到持久层】
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
            deliveries: [],
            regionProps: {
                value: 'name',
                label: 'name',
                children: 'children'
            },
        };
    },
    computed: {},
    components: {
        OrderHeader,
    },
    mounted() {
        // const regions = require("@/api/region2.json");
        // this.regions = regions;
    },

    methods: {
        test1() {
            console.log(this.deliveryFormData);
            this.addressDialogVisible = false;
        }
    },
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
}
</style>