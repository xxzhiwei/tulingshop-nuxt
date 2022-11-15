<template>
    <div class="order-list">
        <order-header title="我的订单" :logoVisible="false" style="padding-top: 0;" :usernameVisible="false">
            <template v-slot:tip>
                <span>请谨防钓鱼链接或诈骗电话，了解更多></span>
            </template>
        </order-header>
        <div class="wrapper">
            <div class="container">
                <div class="order-box">
                    <el-table
                        :data="list" stripe style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <div style="padding-left: 30px;">
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
                        <el-table-column prop="orderSn" min-width="180" label="订单号"></el-table-column>
                        <el-table-column prop="receiverName" label="收货人"></el-table-column>
                        <el-table-column prop="date" label="订单状态" width="120">
                            <template slot-scope="scope">
                                {{scope.row.status | statusFilterText}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="totalAmount" label="总额" width="120">
                            <template slot-scope="scope">
                                {{scope.row.totalAmount}}元
                            </template>
                        </el-table-column>
                        <el-table-column prop="payAmount" label="应付金额" width="120">
                            <template slot-scope="scope">
                                {{scope.row.payAmount}}元
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140" align="center" fixed="right">
                            <template slot-scope="{ row }">
                                <el-button v-if="row.status === 0" type="text" class="x-button-1" size="small" @click="pay(row)">去支付</el-button>
                                <el-button type="text" size="small" class="el-button--danger" @click="del(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :pageSize="listQuery.size" :total="total" @current-change="handleCurrentChange"></el-pagination>
                    <!-- <div class="scroll-more" v-infinite-scroll="scrollMore" infinite-scroll-disabled="true" infinite-scroll-distance="410" v-if="false">
                        <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import OrderHeader from "@/components/OrderHeader";
import { getPagination } from "@/api/order";

const statusMap = {
    0: '待付款',
    1: '待发货',
    2: '已发货',
    3: '已完成',
    4: '已关闭'
};

// 这种页面，其实不需要ssr
export default {
    components: {
        OrderHeader
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
                size: 10,
                current: 1
            }
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
        pay(row) {},
        del(row) {}
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/config.scss";
@import "@/assets/scss/mixin.scss";
.order-list {
    .wrapper {
        background-color: $colorJ;
        padding-top: 33px;
        padding-bottom: 110px;
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