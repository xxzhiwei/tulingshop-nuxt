<template>
    <div class="order-list">
        <order-header title="我的订单" :logoVisible="false" style="padding-top: 0;" :usernameVisible="false">
            <template v-slot:tip>
                <span>请谨防钓鱼链接或诈骗电话，了解更多></span>
            </template>
        </order-header>
        <div class="wrapper">

            <div class="container">
                <el-card style="margin-bottom: 20px;" :body-style="{ 'padding-bottom': '2px' }">
                    <el-form :inline="true" size="mini">
                        <el-form-item label="订单号">
                            <el-input v-model="listQuery.keywords" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select style="width: 168px;" v-model="listQuery.status" placeholder="请选择" clearable>
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="金额">
                            <el-input style="width: 168px;" v-model="listQuery.min" placeholder="请输入" clearable></el-input>
                            -
                            <el-input style="width: 168px;" v-model="listQuery.max" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-date-picker style="width: 168px;" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.start"></el-date-picker>
                            -
                            <el-date-picker style="width: 168px;" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.end"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="x-button-1"  @click="search">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="x-button-1" @click="resetListQuery">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div class="order-box">
                    <el-card>
                        <el-table
                            :data="list" stripe style="width: 100%">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <div style="padding-left: 30px;">
                                        <div>联系人：{{scope.row.receiverName}}</div>
                                        <div>联系电话：{{scope.row.receiverPhone}}</div>
                                        <div>收货地址：{{scope.row.receiverProvince}} {{scope.row.receiverCity}} {{scope.row.receiverRegion}} {{scope.row.receiverDetailAddress}}</div>
                                        <div>商品详情：</div>
                                        <div style="padding-left: 20px;" v-for="(item) in scope.row.items" :key="item.id">
                                            <div style="display: inline-block; margin-right: 10px;"><i class="el-icon-picture-outline" style="margin-right: 5px;"></i>{{item.productName}}</div>
                                            <div style="display: inline-block;">{{item.productPrice}} x {{item.productQuantity}} = {{item.productPrice * item.productQuantity}}元</div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="orderSn" min-width="140" label="订单号"></el-table-column>
                            <el-table-column label="日期" width="180">
                                <template slot-scope="{ row }">
                                    {{row.createTime}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="订单状态" width="120">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.status === 4 ? 'danger' : 'info'">{{scope.row.status | statusFilterText}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="金额">
                                <template slot-scope="scope">
                                    <span>总额：{{scope.row.totalAmount}}元</span>
                                    <br />
                                    <span v-if="scope.row.payType !== 0">支付金额：{{scope.row.payAmount}}元</span>
                                    <span v-else>支付金额：- </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="210" fixed="right">
                                <template slot-scope="{ row }">
                                    <el-button v-if="row.status === 2 || row.status === 3" type="text" size="small">物流信息</el-button>
                                    <el-button v-if="row.status === 0" type="text" class="x-button-1" size="small" @click="pay(row)">去支付</el-button>
                                    <el-button v-if="row.status === 2" type="text" size="small" class="el-button--danger">确认收货</el-button>
                                    <el-button v-if="row.status > 2" type="text" size="small" class="el-button--danger" @click="del(row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="pagination" background layout="total, prev, pager, next" :pageSize="listQuery.size" :total="total" @current-change="handleCurrentChange"></el-pagination>
                    </el-card>
                </div>
            </div>
        </div>
        <el-dialog
            title="请选择支付方式"
            :visible.sync="paymentMethodVisible"
            width="30%">
            <PaymentMethod :orderSn="currentOrder.orderSn" />
        </el-dialog>
    </div>
</template>
<script>
import OrderHeader from "@/components/OrderHeader";
import { getPagination } from "@/api/order";
import PaymentMethod from "@/components/PaymentMethod";
import listMixin from "@/mixins/list";

const statusMap = {
    0: '待付款',
    1: '待发货', // 已付款
    2: '已发货',
    3: '已完成',
    4: '已关闭'
};

const defaultListQuery = {
    size: 10,
    current: 1,
    min: '',
    max: '', start: '', end: '', keywords: '', status: ''
};

// 这种页面，其实不需要ssr
export default {
    mixins: [listMixin],
    components: {
        OrderHeader,
        PaymentMethod
    },
    filters: {
        statusFilterText(value) {
            return statusMap[value] || '未知状态';
        }
    },
    data() {
        return {
            list: [],
            total: 0,
            listQuery: {
                ...defaultListQuery
            },
            defaultListQuery,
            paymentMethodVisible: false,
            currentOrder: {},
            statusList: Object.keys(statusMap).map(key => ({ label: statusMap[key], value: key }))
        };
    },
    created() {
        this.getPagination();
    },
    methods: {
        async getPagination() {
            const resp = await getPagination(this.listQuery);
            if (resp.code !== 0) {
                return this.$message.error("获取数据失败");
            }
            this.list = resp.data.records;
            this.total = resp.data.total;
        },
        handleCurrentChange(current) {
            this.listQuery.current = current;
            this.getPagination();
        },
        pay(row) {
            this.paymentMethodVisible = true;
            this.currentOrder = row;
        },
        del(row) {}
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/config.scss";
@import "@/assets/scss/mixin.scss";
@import "@/assets/scss/el-ui-cover.scss";
.order-list {
    .wrapper {
        background-color: $colorJ;
        padding-top: 33px;
        padding-bottom: 33px;
        .order-box {
            .pagination {
                margin-top: 20px;
                text-align: right;
            }
            .el-pagination.is-background .el-pager li:not(.disabled).active {
                background-color: #ff6600;
            }
            .el-button--primary {
                background-color: #ff6600;
                border-color: #ff6600;
            }
        }
    }
    .el-button--danger {
        span {
            color: #f56c6c !important;
        }
    }
}
</style>