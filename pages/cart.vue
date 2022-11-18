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
                    <el-row style="line-height: 80px; border-bottom: 1px solid #f0f0f0; margin-bottom: 20px;">
                        <el-col :span="2">
                            <el-checkbox class="x-checkbox" v-model="allChecked" @change="handleAllChange" size="medium">全选</el-checkbox>
                        </el-col>
                        <el-col :span="9" style="text-align: left;">
                            <li>商品名称</li>
                        </el-col>
                        <el-col :span="3">
                            <li>单价</li>
                        </el-col>
                        <el-col :span="5" style="text-align: center;">
                            <li>数量</li>
                        </el-col>
                        <el-col :span="3">
                            <li>小计</li>
                        </el-col>
                        <el-col :span="2">
                            <div>操作</div>
                        </el-col>
                    </el-row>
                    <ul v-if="detail.items.length">
                        <li v-for="(item, index) in detail.items" v-bind:key="index">
                            <el-row style="line-height: 40px;">
                                <el-col :span="2">
                                    <el-checkbox class="x-checkbox" size="medium" v-model="item.checked"></el-checkbox>
                                </el-col>
                                <el-col :span="9" style="text-align: left;">
                                    <img style="height: 40px; width: 40px; vertical-align: middle;" v-lazy="item.productPic" alt="">
                                    <span>{{item.title}}</span>
                                </el-col>
                                <el-col :span="3">
                                    <div>{{item.price}}</div>
                                </el-col>
                                <el-col :span="5">
                                    <el-input-number size="small" v-model="item.count" @change="handleCountChange(item)" :min="1"></el-input-number>
                                    <div style="font-size: 12px;">当前库存：{{item.stock || 0}}</div>
                                </el-col>
                                <el-col :span="3">
                                    <div>{{item.count * (item.price * 100) / 100}}</div>
                                </el-col>
                                 <el-col :span="2">
                                    <i class="el-icon-close" style="cursor: pointer;" @click="remove(item)"></i>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                    <div v-else style="text-align: center; padding-bottom: 20px;">
                        购物车空空如也
                    </div>
                </div>
                <div class="order-wrap clearfix">
                    <div class="cart-tip fl">
                        <a href="/#/index">继续购物</a>
                        共<span>{{detail.count}}</span>件商品，已选择<span>{{countChecked}}</span>件，总价<span>{{amount}}</span>
                    </div>
                    <div class="total fr">
                        <a href="javascript:;" class="btn" @click="confirm">去结算</a>
                    </div>
                </div>
            </div>
        </div>
        <service-bar></service-bar>
        <el-dialog class="x-dialog-1" title="确认订单" :visible.sync="confirmationDialogVisible" width="70%">
            <div class="confirmation-wrapper">
                <div class="order-box">
                    <div class="item-address">
                        <div class="addr-title">收货地址</div>
                        <div class="addr-list clearfix">
                            <div class="addr-info" :class="{ checked: index === deliveryChecked }" @click="deliveryChecked = index" v-for="(item, index) in deliveryList" :key="index">
                                <div style="margin-bottom: 10px;">{{ item.phoneNumber }} {{ item.name }} </div>
                                <div class="street" style="margin-bottom: 10px;">
                                    {{item.province}} {{item.city}} {{item.region}} {{item.detailAddress}}
                                </div>
                                <div class="action" @click.stop>
                                    <el-radio class="x-radio-1" @change="setDefault(item, index)" v-model="item.defaultStatus" :label="1">默认地址</el-radio>
                                    <div style="float: right;">
                                        <i class="el-icon-delete" style="margin-right: 10px;" @click="delDelivery(item)"></i>
                                        <i class="el-icon-edit" @click="showDeliveryDialogForUpdating(item)"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="addr-add" @click="showDeliveryDialogForSaving">
                                <div class="icon-add"></div>
                                <div>添加新地址</div>
                            </div>
                        </div>
                    </div>
                    <div class="item-good">
                        <div>商品</div>
                        <ul>
                            <li style="text-align: right;" v-for="(item, index) in itemChecked" :key="index">
                                <div class="good-name" style="float: left;">
                                    <span><i class="el-icon-picture-outline" style="margin-right: 5px;"></i>{{item.title}}</span>
                                </div>
                                <div class="good-price" style="display: inline-block; margin-right: 20px;">
                                    {{item.count}} x {{item.price}}
                                </div>
                                <div class="good-total" style="display: inline-block;">= {{item.amount}}元</div>
                            </li>
                        </ul>
                    </div>
                    <div class="detail">
                        <div class="item">
                            <span class="item-name">商品件数：</span>
                            <span class="item-val">{{countChecked}}件</span>
                        </div>
                        <div class="item">
                            <span class="item-name">商品总价：</span>
                            <span class="item-val">{{amount}}元</span>
                        </div>
                        <div class="item">
                            <span class="item-name">运费：</span>
                            <span class="item-val">{{countChecked * 2}}元</span>
                        </div>
                        <div class="item-total">
                            <span class="item-name">应付总额：</span>
                            <span class="item-val">{{amount}}元</span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="x-button-1" style="border-radius: 0" type="primary" :disabled="creationDisabled" @click="createOrder">提交订单</el-button>
            </div>
        </el-dialog>

        <el-dialog class="x-dialog-1" title="新增或编辑收货方式" :visible.sync="deliveryDialogVisible" width="35%" append-to-body>
            <el-form ref="deliveryForm" :model="deliveryFormData" :rules="deliveryRules" label-width="80px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="deliveryFormData.name" required></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="deliveryFormData.phoneNumber" required></el-input>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        ref="pcrCascader"
                        v-model="pcr"
                        :options="pcrList" :props="pcrProps" @change="handlePcrChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailAddress">
                    <el-input v-model="deliveryFormData.detailAddress" type="textarea" :rows="2"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button v-if="!deliveryFormData.id" class="x-button-1" type="primary" style="border-radius: 0" @click="saveDelivery">确 定</el-button>
                <el-button v-else class="x-button-1" type="primary" style="border-radius: 0" @click="updateDelivery">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import OrderHeader from "@/components/OrderHeader";
import ServiceBar from "@/components/ServiceBar";
import { getDetail, updateCount, remove } from "@/api/cart";
import { create as createOrder } from "@/api/order";
import { getList as getDeliveryList, save as saveDelivery, update as updateDelivery, del as delDelivery, setDefault } from "@/api/delivery"

const defaultDeliveryFormData = {
    id: null, // id只有更新时存在
    name: "",
    phoneNumber: "",
    name: "",
    postCode: "",
    province: "",
    city: "",
    region: "",
    detailAddress: "",
    defaultStatus: 0
};

function phoneValidator(rule, value, callback) {
    if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error(rule.message));
    }
    else {
        callback();
    }
}

export default {
    components: {
        OrderHeader,
        ServiceBar,
    },
    data() {
        return {
            detail: {
                items: [],
                count: 0
            },
            allChecked: false, // 是否全选
            confirmationDialogVisible: false,
            deliveryDialogVisible: false,
            deliveryFormData: { ...defaultDeliveryFormData },
            pcr: [], // 省市区【province&city&region】
            pcrList: [],
            deliveryList: [],
            pcrProps: {
                value: 'fullname',
                label: 'fullname',
                children: 'children'
            },
            deliveryChecked: -1,
            deliveryRules: {
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                phoneNumber: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: phoneValidator, message: '手机号格式不正确', trigger: 'blur' }
                ]
            },
            creationDisabled: false
        };
    },
    watch: {
        itemChecked(n) {
            if (n.length !== 0 && n.length === this.detail.items.length) {
                this.allChecked = true;
            }
            else {
                this.allChecked = false;
            }
        }
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
    mounted() {
        const pcrList = require("@/api/pcr.json");
        this.pcrList = pcrList;
    },
    created() {
        this.getDetail();
    },
    methods: {
        async getDetail() {
            const resp = await getDetail();

            if (resp.code !== 0) {
                return this.$message.warning("获取购物车信息失败");
            }

            if (resp.data.items === null) {
                resp.data.items = [];
            }
            else {
                for (const item of resp.data.items) {
                    item.checked = false;
                }
            }
            this.detail = resp.data;
        },
        handleCountChange(item) {
            const params = {
                skuId: item.skuId,
                count: item.count
            };
            this.updateCount(params);
        },
        // 更新商品数量
        async updateCount(params) {
            const resp = await updateCount(params);
            if (resp.code !== 0) {
                return this.$message.warning("更新商品数量失败");
            }
        },
        // 移除商品
        remove(item) {
            this.$confirm("确定要移除当前商品吗", "提示")
                .then(async () => {
                    const params = {
                        skuId: item.skuId
                    };
                    const resp = await remove(params);
                    if (resp.code !== 0) {
                        return this.$message.warning("移除商品失败");
                    }
                    this.detail.items = this.detail.items.filter(other => other.id !== item.id);
                })
                .catch(() => console.log('cancel'));
        },

        // 创建订单【显示是购买，但其实并不是】
        async purchase() {
            // const resp = await purchase();
        },
        handleAllChange(value) {
            for (const item of this.detail.items) {
                item.checked = value;
            }
        },
        check() {
            this.$refs.deliveryForm.validate(valid => {
                if (valid) {
                    return true;
                }
                throw new Error('校验失败');
            });
        },
        async saveDelivery() {
            try {
                this.check();
                const resp = await saveDelivery(this.deliveryFormData);

                if (resp.code !== 0) {
                    return this.$message.warning("操作失败");
                }
                this.$message.warning("操作成功");
                this.deliveryDialogVisible = false;

                // 重新请求收货地址数据；
                this.getDeliveryList();
            } catch (error) {
                console.log(error);
            }
        },
        // 如果参数长度为3，则为省市区；如果为2，则为省市【要求至少要省市，否则认为是错误的数据】
        handlePcrChange(pcr) {
            if (!pcr || pcr.length < 2) {
                return console.error("pcr参数错误");
            }
            const fields = ['province', 'city', 'region'];
            for (let i=0; i<pcr.length; i++) {
                this.deliveryFormData[fields[i]] = pcr[i];
            }

            // 返回的是最后的节点【一个】
            const checked = this.$refs.pcrCascader.getCheckedNodes()[0];
            this.deliveryFormData.postCode = checked.data.aid;
        },
        // 显示添加收货地址模态框
        showDeliveryDialogForSaving() {
            this.deliveryFormData = { ...defaultDeliveryFormData };
            this.deliveryDialogVisible = true;
        },
        // 显示编辑收货地址模态框
        showDeliveryDialogForUpdating(data) {
            this.deliveryFormData = { ...data };
            this.pcr.push(this.deliveryFormData.province, this.deliveryFormData.city);
            if (this.deliveryFormData.region) {
                this.pcr.push(this.deliveryFormData.region);
            }
            this.deliveryDialogVisible = true;
        },
        // 删除收货地址
        delDelivery(item) {
            this.$confirm("确定要删除当前收货地址吗", "提示")
                .then(async () => {
                    const params = {
                        id: item.id
                    };
                    const resp = await delDelivery(params);
                    if (resp.code !== 0) {
                        return this.$message.warning("操作失败");
                    }
                    this.deliveryList = this.deliveryList.filter(other => other.id !== item.id);
                })
                .catch(() => console.log('cancel'));
        },
        async updateDelivery() {
            const resp = updateDelivery(this.deliveryFormData);
            if (resp.code !== 0) {
                return this.$message.warning("操作失败");
            }
            this.deliveryDialogVisible = false;
            this.getDeliveryList();
        },
        // 创建订单前，对订单进行确认【必须勾选购物车中的商品】
        async confirm() {
            if (this.detail.items.length === 0) {
                return this.$message.warning("购物车空空如也");
            }

            if (this.itemChecked.length === 0) {
                return this.$message.warning("请先勾选要支付的商品");
            }

            this.confirmationDialogVisible = true;
            const deliveryList = await this.getDeliveryList();
            const defaultIndex = deliveryList.findIndex(item => item.defaultStatus === 1);
            if (defaultIndex !== -1) {
                this.deliveryChecked = defaultIndex;
            }
        },
        // 获取收货地址列表
        async getDeliveryList() {
            const resp = await getDeliveryList();
            this.deliveryList = resp.data;
            return this.deliveryList;
        },
        // 设置默认地址
        async setDefault(item, index) {
            const params = {
                id: item.id
            };
            const resp = await setDefault(params);

            if (resp.code !== 0) {
                return this.$message.warning("设置失败");
            }
            this.getDeliveryList();
            this.deliveryChecked = index;
        },
        async createOrder() {
            this.disabled = true;
            const params = {
                skuIds: this.itemChecked.map(item => item.skuId),
                delivery: this.deliveryList[this.deliveryChecked]
            };
            const resp = await createOrder(params);
            this.confirmationDialogVisible = false;
            this.creationDisabled = false;
            if (resp.code !== 0) {
                return this.$message.warning("下单失败");
            }
            this.getDetail();
            this.$router.push({
                path: "/order/result",
                query: {
                    orderSn: resp.data
                }
            });
        }
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/el-ui-cover.scss";

.el-message-box__wrapper {
    .el-message-box__btns {
        button:last-child {
            background-color: #FF6600;
            border-color: #FF6600;
        }
        button:first-child:hover {
            background-color: #fff;
            border-color: #FF6600;
            span {
                color: #FF6600;
            }
        }
    }
    .el-message-box__headerbtn:hover .el-message-box__close{
        color: #FF6600;
    }
}
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
    .confirmation-wrapper {
        .order-box {
            .addr-title {
                color: #333333;
                margin-bottom: 21px;
            }
            .item-address {
                .addr-list {
                    .addr-info,
                    .addr-add {
                        box-sizing: border-box;
                        float: left;
                        width: 251px;
                        height: 144px;
                        border: 1px solid #e5e5e5;
                        margin-right: 15px;
                        padding: 15px;
                        font-size: 14px;
                        color: #757575;
                    }
                    .addr-info {
                        cursor: pointer;
                        .street {
                            height: 3em;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
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
                            margin-top: 30px;
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
                    height: 40px;
                    line-height: 40px;
                    margin-top: 10px;
                    font-size: 16px;
                    color: #333333;
                    .good-total {
                        color: #ff6600;
                    }
                }
            }
            .detail {
                padding-top: 30px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f1f1f1;
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
        }
    }
}
</style>