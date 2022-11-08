<template>
    <div class="detail">
        <product-param v-bind:title="detail.name"></product-param>
        <div class="wrapper">
            <div class="container clearfix">
                <div class="left">
                    <div class="image-wrapper">
                        <img v-lazy="detail.pic" alt="">
                    </div>
                </div>
                <div class="content">
                    <h2 class="item-title">{{ detail.name }}</h2>
                    <p class="item-info">{{ detail.subTitle }}</p>
                    <div class="item-price">{{ skuDetail.price || detail.price  }}元</div>
                    <div class="line"></div>
                    <div class="item-version clearfix" v-for="(item) of detail.saleAttrs" :key="item.id">
                        <h2 style="font-weight: 500;">选择{{item.name}}</h2>
                        <div class="phone fl"
                            v-for="(saleAttrItem, index) of item.items"
                            :key="saleAttrItem.value"
                            :class="[{checked: activedMap[item.id] === index, disabled: disabledMap[item.id + ':' + index]}]" @click="onSaleAttrChange(item, saleAttrItem, index)">
                            {{saleAttrItem.value}}
                        </div>
                    </div>
                    <div class="item-version clearfix" style="margin-top: 10px; color: #ccc;">
                        库存量：{{skuDetail.stock || 0}}
                    </div>
                    <div class="item-total">
                        <div class="phone-info clearfix">
                            
                            <template v-if="skuDetail.id">
                                <div class="fl" >
                                    {{skuDetail.name}}
                                </div>
                                <div class="fr">
                                    {{skuDetail.price}}元
                                </div>
                            </template>
                        </div>
                        <div class="phone-total">总计：{{skuDetail.price || 0}}元</div>
                    </div>
                    <div class="btn-group">
                        <a href="javascript:;" class="btn btn-large fl" @click="addToCart">加入购物车</a>
                        <a href="javascript:;" class="btn btn-large btn-buy fl" @click="buy">立即购买</a>
                    </div>

                    <!-- <div class="after-sale-info">
                        <span><a href="javascript:void(0);" v-if="serviceIds.includes('1')" class="support">
                                <i class="fa fa-check-circle-o f2" aria-hidden="true"></i>
                                <em>无忧退货</em>
                            </a>
                        </span>
                        <span><a href="javascript:void(0);" v-if="serviceIds.includes('2')" class="support">
                                <i class="fa fa-check-circle-o f2" aria-hidden="true"></i>
                                <em>快速退款</em>
                            </a>
                        </span>
                        <span><a href="javascript:void(0);" v-if="serviceIds.includes('3')" class="support">
                                <i class="fa fa-check-circle-o f2" aria-hidden="true"></i>
                                <em>免费包邮</em>
                            </a>
                        </span>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="price-info">
            <div class="container">
                <h2>商品介绍</h2>
                <template v-if="detail.attrGroups && detail.attrGroups.length > 0">
                    <div style="font-size: 16px; margin-bottom: 8px;">规格属性</div>
                    <div class="group-wrapper" v-for="(item) in detail.attrGroups" :key="item.id">
                        <div class="group-name">{{item.name}}</div>
                        <ul>
                            <li v-for="(item2) in item.attrs" :key="item2.id">
                                {{ item2.name }}:&nbsp;{{ item2.value }}
                            </li>
                        </ul>
                    </div>
                </template>
                <!-- <div class="desc" v-html="detail.detailHtml"> -->
                    <!-- <img src="/imgs/detail/item-price.jpeg" alt=""> -->
                <!-- </div> -->
            </div>
        </div>
        <service-bar></service-bar>
    </div>
</template>
<script>
import ProductParam from "@/components/ProductParam";
import ServiceBar from "@/components/ServiceBar";
import { getDetail } from "@/api/product";
import { getDetail as getSkuDetail } from "@/api/sku";
import { getIntersection } from "@/utils/common";
import { add } from "@/api/cart";

export default {
    name: "detail",
    components: {
        ProductParam,
        ServiceBar,
    },
    async asyncData({ params }) {
        const { id } = params;
        const resp = await getDetail(id);
        if (resp.code !== 0) {
            throw new Error("获取数据失败");
        }

        // spuId=44；
        // resp.data.saleAttrs[0].items[0].skuIds = "27";
        // resp.data.saleAttrs[1].items[1].skuIds = "28";

        // 高亮映射
        const activedMap = {};
        // 禁用映射
        const disabledMap = {};
        for (const saleAttr of resp.data.saleAttrs) {
            activedMap[saleAttr.id] = -1;
            for (let i=0; i<saleAttr.items.length; i++) {
                disabledMap[saleAttr.id + ':' + i] = false;
            }
        }

        return {
            detail: resp.data,
            skuDetail: {},
            activedMap,
            disabledMap,
        }
    },
    methods: {
        async getSkuDetail(id) {
            const resp = await getSkuDetail(id);
            if (resp.code !== 0) {
                throw new Error("获取sku数据失败");
            }
            this.skuDetail = resp.data;
        },
        /**
         * 检查每个属性是否都包含『当前选择的属性中的skuId』，如果没有则取消高亮；如果全部销售属性都选中了的情况下（高亮），将会决定一个skuId，此时应该重新向后台请求数据
         * @param currentSaleAttr 当前销售属性
         * @param currentSaleAttrItem 当前销售属性的选中项
         * @param currentIndex 当前销售属性的选中项的下标
         */
        onSaleAttrChange(currentSaleAttr, currentSaleAttrItem, currentIndex) {
            if (this.disabledMap[currentSaleAttr.id + ':' + currentIndex]) {
                return;
            }

            let currentSkuIds = currentSaleAttrItem.skuIds.split(",");

            if (this.activedMap[currentSaleAttr.id] === currentIndex) {
                this.activedMap[currentSaleAttr.id] = -1;
            }
            else {
                this.activedMap[currentSaleAttr.id] = currentIndex;
            }

            const skuIdMap = {}; // 用于统计选中的skuId
            let target;
            for (let saleAttr of this.detail.saleAttrs) {
                if (saleAttr.id === currentSaleAttr.id) {
                    continue;
                }
                // 获取其他属性的高亮选项的下标，并用其的skuIds与currentSaleAttrItem的skuIds取交集，如果交集为空集则取消高亮
                const otherIndex = this.activedMap[saleAttr.id];

                for (let i=0; i<saleAttr.items.length; i++) {
                    const otherSkuIds = saleAttr.items[i].skuIds.split(",");
                    const result = getIntersection(currentSkuIds, otherSkuIds);
                    // console.log(saleAttr.name, currentSkuIds, otherSkuIds, result, otherIndex);
                    // 若没有交集，则取消高亮，并禁用选项
                    if (result.length === 0) {
                        if (otherIndex === i) {
                            this.activedMap[saleAttr.id] = -1;
                        }

                        // 若当前是取消选择时，恢复被禁用
                        if (this.activedMap[currentSaleAttr.id] === -1) {
                            this.disabledMap[saleAttr.id + ':' + i] = false;
                        }
                        else {
                            this.disabledMap[saleAttr.id + ':' + i] = true;
                        }
                    }
                    // 取消禁用
                    else {
                        // 如果有交集，并且i为当前高亮的选项时，进行统计
                        if (otherIndex === i) {
                            for (const skuId of result) {
                                if (skuIdMap[skuId]) {
                                    skuIdMap[skuId]++;
                                    // 其中当前选中得属性不用统计（当前选中得属性必定会有对应得skuId），所以是-1
                                    if (skuIdMap[skuId] == this.detail.saleAttrs.length - 1) {
                                        target = skuId;
                                    }
                                }
                                else {
                                    skuIdMap[skuId] = 1;
                                }
                            }
                        }
                        // 已经选中属性，且交集只有一个时，禁用不在skuIdMap中的其他skuId
                        if (otherIndex !== -1 && otherSkuIds.length === 1 && result.length === 1 && !skuIdMap[result[0]]) {
                            this.disabledMap[saleAttr.id + ':' + i] = true;
                        }
                        else {
                            this.disabledMap[saleAttr.id + ':' + i] = false;
                        }
                    }
                }
            }

            if (target) {
                this.getSkuDetail(target);
            }
            else {
                this.skuDetail = {};
            }
        },


        // 目前还未考虑到商品数量，默认一个
        async buy() {
            if (!this.skuDetail.id) {
                return this.$message.warning("请选择版本");
            }
            if (this.skuDetail.stock < 1) {
                return this.$message.warning("库存量不足，请选择其他版本");
            }
            const params = {
                skuId: this.skuDetail.id,
                count: 1
            };
            // console.log(params);
            const resp = await add(params);

            if (resp.code !== 0) {
                return this.$message.warning("购买失败");
            }

            // 跳转至购物车界面
            this.$router.push("/cart");
        },
        async addToCart() {
            // const params = {
            //     skuId: this.detail.id,
            //     count: 1
            // };
            // const resp = await add(params);

            // if (resp.code !== 0) {
            //     return this.$message.warning("加入购物车失败");
            // }

        }
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/config.scss";
@import "@/assets/scss/mixin.scss";

.detail {
    .group-wrapper {
        color: #666;
        .group-name {
            font-size: 14px;
            margin-bottom: 5px;
        }
        ul {
            padding-left: 10px;
        }
        li {
            margin-bottom: 5px;
        }
    }
    .stock {
        margin-top: 15px;
        color: #ff6700;
    }
    .wrapper {
        > .container { 
            display: flex;
        }
        .left {
            width: 642px;
            height: 617px;
            margin-top: 5px;
            .image-wrapper {
                width: 600px;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .content {
            width: 584px;
            height: auto;
            margin-left: 20px;
            .item-title {
                font-size: 28px;
                padding-top: 30px;
                padding-bottom: 16px;
                height: 66px;
            }
            .item-info {
                font-size: 14px;
                height: 36px;
            }
            .delivery {
                font-size: 16px;
                color: #ff6700;
                margin-top: 26px;
                margin-bottom: 14px;
                height: 15px;
            }
            .item-price {
                font-size: 20px;
                color: #ff6700;
                height: 19px;
                .del {
                    font-size: 16px;
                    color: #999999;
                    margin-left: 10px;
                    text-decoration: line-through;
                }
            }
            .btn-group {
                width: 100%;
                height: 54px;
            }
            .after-sale-info {
                margin: 20px 0px;
                a {
                    display: inline-block;
                    margin-right: 55px;
                    line-height: 30px;
                    margin-bottom: 10px;
                    cursor: default;
                    white-space: nowrap;
                    color: #b0b0b0;
                }
                i {
                    font-size: 24px;
                    display: inline-block;
                    font-style: normal;
                    vertical-align: middle;
                }
                em {
                    font-style: normal;
                    display: inline-block;
                    margin-left: 2px;
                    vertical-align: middle;
                    font-size: 16px;
                }
            }
            .line {
                height: 0;
                margin-top: 25px;
                margin-bottom: 28px;
                border-top: 1px solid #e5e5e5;
            }
            .item-addr {
                // height: 108px;
                background-color: #fafafa;
                border: 1px solid #e5e5e5;
                box-sizing: border-box;
                padding-top: 31px;
                padding-left: 64px;
                font-size: 14px;
                line-height: 14px;
                position: relative;
                .icon-loc {
                    position: absolute;
                    top: 27px;
                    left: 34px;
                    @include bgImg(20px, 20px, "/imgs/detail/icon-loc.png");
                }
                .addr {
                    color: #666666;
                }
                .stock {
                    margin-top: 15px;
                    color: #ff6700;
                }
            }
            .item-version,
            .item-color {
                margin-top: 30px;
                h2 {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
            }
            .item-version,
            .item-color {
                .phone {
                    width: 50%;
                    height: 50px;
                    line-height: 50px;
                    font-size: 16px;
                    color: #333333;
                    border: 1px solid #e5e5e5;
                    box-sizing: border-box;
                    text-align: center;
                    cursor: pointer;
                    span {
                        color: #666666;
                        margin-left: 15px;
                    }
                    .color {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        background-color: #666666;
                    }
                    &.checked {
                        border: 1px solid #ff6600;
                        color: #ff6600;
                    }
                }
                .disabled {
                    color: #b0b0b0;
                    cursor: auto;
                }
            }
            .item-total {
                height: 108px;
                background: #fafafa;
                padding: 24px 33px 29px 30px;
                font-size: 14px;
                margin-top: 50px;
                margin-bottom: 30px;
                box-sizing: border-box;
                .phone-total {
                    font-size: 24px;
                    color: #ff6600;
                    margin-top: 18px;
                }
            }
        }
    }
    .price-info {
        background-color: #f3f3f3;
        height: auto;
        margin-top: 20px;
        padding-bottom: 30px;
        h2 {

            text-align: center;
            font-size: 24px;
            color: #333333;
            padding-top: 38px;
            margin-bottom: 30px;
            border-bottom: coral 2px solid;
            line-height: 50px;
        }
        .attributes-list {
            width: 749px;
            display: block;
            clear: both;
            margin: 20px auto;
            min-height: 50px;
            text-align: left;
            li {
                display: inline;
                float: left;
                width: 206px;
                height: 24px;
                margin-right: 20px;
                overflow: hidden;
                text-indent: 5px;
                line-height: 24px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>