<template>
    <div class="index">
        <div class="product-box">
            <div class="breadcrumb-wrapper">
                <div class="container">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '>' }">首页</el-breadcrumb-item>
                        <!-- <el-breadcrumb-item v-for="item in conditions" :key="item.name">{{item.name}}: {{item.value}}</el-breadcrumb-item> -->
                        <el-breadcrumb-item>
                            <div class="condition-wrapper">
                                <div class="item" v-for="(item, index) in conditions" :key="item.name">
                                    <span>{{item.name}}: {{item.value}}</span>
                                    <span class="close" @click="onRemoveCondition(index, item)">x</span>
                                </div>
                            </div>
                            "{{keywords}}"
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <div class="category-wrapper" style="border-bottom: 1px solid rgb(231 231 231);" v-if="categoryList.length > 0">
                <div class="container">
                    <div class="item">分类</div>
                    <div :class="['item', { 'actived': index === categoryActived }]" v-for="(item, index) in categoryList" :key="item.id" @click="onCategoryChange(index, item)">{{item.name}}</div>
                </div>
            </div>
            <div class="brand-wrapper" v-if="brandList.length > 0">
                <div class="container"> 
                    <div class="item">品牌</div>
                    <div :class="['item', { 'actived': index === brandActived }]" v-for="(item, index) in brandList" :key="item.id" @click="onBrandChange(index, item)">{{item.name}}</div>
                </div>
            </div>
            <div class="container">
                <div class="order-wrapper">
                    <div 
                        :class="['item', { 'actived': index === orderActived }]" 
                        v-for="(item, index) in orderList" :key="item.id"
                        @click="onOrderChange(index, item)">
                            {{item.name}}
                            <i class="el-icon-bottom" v-if="item.name !== PRICE_TEXT"></i>
                            <i v-else :class="sort === 4 ? 'el-icon-top' : 'el-icon-bottom'"></i>
                        </div>
                </div>
                <div class="product-wrapper">
                    <div class="item" v-for="(item) in list" v-bind:key="item.id">
                        <a :href="`/product/${item.id}`" target="_blank">
                            <div class="item-img">
                                <img v-lazy="item.pic" alt="">
                            </div>
                            <div class="item-info" style="width: 75%; margin: 0 auto;">
                                <h3>{{item.name}}</h3>
                                <p class="price">
                                    <span>{{item.price}}元起</span>
                                </p>
                            </div>
                            <div>
                                <el-button type="text" icon="el-icon-shopping-cart-2" style="color: #F56C6C;">购买</el-button>
                            </div>
                        </a>
                    </div>
                </div>
                <div style="margin-top: 2%; text-align: center;">
                    <el-pagination
                        background @current-change="onCurrentChange"
                        :page-size="50"
                        layout="total, prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getPagination } from "@/api/search";

const PRICE_TEXT = "价格";

const orders = [
    {
        name: '综合',
        id: '1'
    },
    {
        name: '销量',
        id: '2'
    },
    {
        name: '新品',
        id: '5',
    },
    {
        name: PRICE_TEXT,
        id: '3,4'
    },
];

export default {
    watchQuery: ['keywords', 'current', 'categoryId', 'brandId', 'sort'],
    // 这里是无法使用控制台输出的，因为不是在客户端渲染出来的；
    async asyncData({ query }) {
        // 返回的可以直接当做
        const { keywords, current, categoryId, brandId, sort } = query;
        if (!keywords) {
            throw new Error("keywords不能为空");
        }
        const params = {};
        params.keywords = keywords;

        if (current) {
            params.current = current;
        }
        if (categoryId) {
            params.categoryId = categoryId;
        }
        if (brandId) {
            params.brandId = brandId;
        }

        if (sort) {
            params.sort = sort;
        }

        
        const resp = await getPagination(params).catch(error => {
            console.log(error);
        });
        if (resp.code !== 0) {
            throw new Error("获取数据失败");
        }

        const { records, total, brands, categories } = resp.data;
        let brandActived = 0, categoryActived = 0, orderActived;
        const conditions = [];

        // 高亮&
        if (brands && brands.length > 0) {
            if (brandId) {
                brandActived = brands.findIndex(item => item.id === +brandId);
            }
            if (brands.length > 1) {
                brands.unshift({
                    id: "",
                    name: "全部"
                });
            }
        }
        if (categories && categories.length > 0) {
            if (categoryId) {
                categoryActived = brands.findIndex(item => item.id === +categoryActived);
            }
            if (categories.length > 1) {
                categories.unshift({
                    id: "",
                    name: "全部"
                });
            }
        }

        if (records && records.length) {

            if (categoryId) {
                conditions.push({
                    name: '分类',
                    value: records[0].productCategoryName,
                    field: 'categoryId'
                });
            }
            if (brandId) {
                conditions.push({
                    name: '品牌',
                    value: records[0].brandName,
                    field: 'brandId'
                });
            }
        }

        if (sort) {
            orderActived = orders.findIndex(item => item.id === sort || item.id.includes(sort));
        }

        return {
            list: records,
            brandList: brands,
            categoryList: categories,
            keywords,
            total,
            brandActived,
            categoryActived,
            orderList: orders,
            orderActived: orderActived,
            conditions,
            sort: +sort,
            PRICE_TEXT
        };

        // return {
        //     list: [],
        //     brandList: [],
        //     categoryList: [],
        //     keywords,
        //     total: 0,
        //     brandActived: 1,
        //     categoryActived: 1,
        //     orderList: [],
        //     orderActived: 1,
        //     conditions: [],
        //     sort: 1,
        //     PRICE_TEXT
        // };
    },
    methods: {
        onBrandChange(index, item) {
            if (index === this.brandActived) {
                return;
            }
            this.brandActived = index;
            const q = { ...this.$route.query };
            q.brandId = item.id;
            this.$router.push({
                path: this.$route.path,
                query: q
            });
        },
        onCategoryChange(index, item) {
            if (index === this.categoryActived) {
                return;
            }
            this.categoryActived = index;
            const q = { ...this.$route.query };
            q.categoryId = item.id;
            this.$router.push({
                path: this.$route.path,
                query: q
            });
        },
        onOrderChange(index, item) {
            this.orderActived = index;
            const q = { ...this.$route.query };
            
            if (item.name === PRICE_TEXT) {
                const arr = item.id.split(",");
                let sort = q.sort === arr[0] ? arr[1] : arr[0];
                q.sort = sort;
                this.sort = +sort;
            }
            else {
                q.sort = item.id;
            }

            this.$router.push({
                path: this.$route.path,
                query: q
            });
        },
        onRemoveCondition(index, item) {
            this.conditions = this.conditions.filter(item => item !== item);
            const q = { ...this.$route.query };
            // delete q[item.field]; // 删除不能触发
            q[item.field] = "";

            this.$router.push({
                path: this.$route.path,
                query: q
            });
        },
        onCurrentChange(value) {
            const q = { ...this.$route.query };
            q.current = value;
            this.$router.push({
                path: this.$route.path,
                query: q
            });
        },
    }
};
</script>
<style lang="scss">
@import "@/assets/scss/config.scss";
@import "@/assets/scss/mixin.scss";

.index {
    .actived {
        color: #ff6600;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #ff6600;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #ff6600;
    }
    .breadcrumb-wrapper {
        height: 40px;
        padding-top: 10px;
        box-sizing: border-box;
        .el-breadcrumb {
            line-height: 1.5;
        }
    }
    .el-breadcrumb__separator {
        color: #777;
    }
    .brand-wrapper, .category-wrapper {
        background-color: #fff;
        padding: 10px 0;
        font-size: 16px;
        .container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
        .item {
            padding: 0 30px;
        }
        .item:first-child {
            color: #b0b0b0;
        }
        .item:not(:first-child) {
            cursor: pointer;
        }
    }
    .condition-wrapper {
        display: inline-block;
        .item {
            padding: 0 22px 0 5px;
            border: 1px solid #ccc;
            position: relative;
            background-color: #fff;
            cursor: pointer;
            .close {
                position: absolute;
                width: 20px;
                top: 0;
                right: 0;
                text-align: center;
                font-weight: bold;
            }
        }
        .item:hover {
            border-color: #F56C6C;
            .close {
                background-color: #F56C6C;
                color: #fff;
            }
        }
    }
    .order-wrapper {
        padding-top: 1%;
        height: 30px;
        .item {
            float: left;
            padding: 0 30px;
            text-align: center;
            cursor: pointer;
        }
        .item:not(:last-child) {
            border-right: 1px solid #ccc;
        }
    }
    .product-box {
        background-color: $colorJ;
        padding: 10px 0 50px;
        h2 {
            font-size: $fontF;
            height: 21px;
            line-height: 21px;
            color: $colorB;
            margin-bottom: 20px;
        }
        .product-wrapper {
            display: flex;
            flex-wrap: wrap;
            .item:hover {
                box-shadow: 3px 5px 15px rgba(0, 0, 0, 0.15);
                .item-info {
                    h3 {
                        // color: #ff6700;
                        color: #dc5a5a;
                    }
                }
            }
            .item {
                // width: 25%;
                width: 24%;
                height: 365px; // 430px
                background-color: $colorG;
                text-align: center;
                padding-top: 45px;
                margin-bottom: 1%;
                margin-right: 1%;
                cursor: pointer;
                transition: box-shadow .3s linear,-webkit-box-shadow .3s linear;
                .item-img {
                    width: 200px;
                    height: 200px;
                    margin: 0 auto 16px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .item-info {
                    padding-top: 10px;
                    h3 {
                        font-size: $fontJ;
                        // color: $colorB;
                        color: #757575;
                        line-height: $fontJ;
                        // font-weight: bold;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        margin-bottom: 15px;
                    }
                    p {
                        
                        color: $colorD;
                        line-height: 13px;
                        // margin: 6px auto 13px;
                        margin-bottom: 5px;
                    }
                    .price {
                        // color: #f20a0a;
                        // color: #ff6700;
                        // color: #F56C6C;
                        color: #F56C6C;
                        font-size: $fontJ;
                        // font-weight: bold;
                    }
                }
            }
        }
    }
}
</style>