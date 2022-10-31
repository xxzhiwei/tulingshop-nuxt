<template>
    <div class="index">
        <div class="product-box">
            <div class="breadcrumb-wrapper">
                <div class="container">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '>' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>"{{keywords}}"</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <div class="category-wrapper" style="border-bottom: 1px solid rgb(231 231 231);" v-if="categoryList && categoryList.length > 1">
                <div class="container">
                    <div class="item">分类</div>
                    <div class="item" v-for="item in categoryList" :key="item.id">{{item.name}}</div>
                </div>
            </div>
            <div class="brand-wrapper" v-if="brandList && brandList.length > 1">
                <div class="container"> 
                    <div class="item">品牌</div>
                    <div class="item" v-for="item in brandList" :key="item.id">{{item.name}}</div>
                </div>
            </div>
            <div class="container">
                <div class="order-wrapper">
                    <div class="item">综合</div>
                    <div class="item">新品</div>
                    <div class="item">销量</div>
                    <div class="item">价格</div>
                </div>
                <div class="product-wrapper">
                    <div class="item" v-for="(item) in list" v-bind:key="item.id">
                        <a>
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
            </div>
        </div>
    </div>
</template>
<script>
import { getPagination } from "@/api/search";

export default {
    watchQuery: ['keywords'],
    // 这里是无法使用控制台输出的，因为不是在客户端渲染出来的；
    async asyncData({ query }) {
        // 返回的可以直接当做
        const { keywords } = query;
        if (!keywords) {
            throw new Error("keywords不能为空");
        }
        const params = {};
        params.keywords = keywords;
        const resp = await getPagination(params);
        if (resp.code !== 0) {
            throw new Error("获取数据失败");
        }
        const { records, total, brands, categories } = resp.data;
        return {
            list: records,
            brandList: brands,
            categoryList: categories,
            keywords,
            total
        };
        // return {
        //     list: [],
        //     brandList: [],
        //     categoryList: [],
        //     keywords,
        //     total: 0
        // };
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/config.scss";
@import "@/assets/scss/mixin.scss";

.index {
    .breadcrumb-wrapper {
        height: 40px;
        padding-top: 10px;
        box-sizing: border-box;
    }
    .el-breadcrumb__separator {
        color: #777;
    }
    .brand-wrapper, .category-wrapper {
        background-color: #fff;
        padding: 10px 0;
        .container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
        .item {
            width: 5%;
            // padding: 10px 30px;
            padding: 10px 0;
        }
        .item:first-child {
            // width: 7%;
            color: #b0b0b0;
        }
    }
    .order-wrapper {
        padding-top: 1%;
        height: 30px;
        .item {
            float: left;
            padding: 0 30px;
            text-align: center;
            // display: inline-block;
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
                // span {
                //     display: inline-block;
                //     width: 67px;
                //     height: 24px;
                //     font-size: 14px;
                //     line-height: 24px;
                //     color: $colorG;
                //     &.new-pro {
                //         background-color: #7ecf68;
                //     }
                //     &.kill-pro {
                //         background-color: #e82626;
                //     }
                // }
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