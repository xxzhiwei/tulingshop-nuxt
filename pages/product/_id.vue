<template>
    <div class="detail">
        <product-param v-bind:title="detail.name"></product-param>
        <div class="wrapper">
            <div class="container clearfix">
                <div class="left">
                    <div class="image-wrapper">
                        <!-- <img v-lazy="detail.pic" alt=""> -->
                        <img :src="detail.pic" alt="">
                    </div>
                </div>
                <div class="content">
                    <h2 class="item-title">{{ detail.name }}</h2>
                    <p class="item-info">{{ detail.subTitle }}</p>
                    <div class="item-price">{{ skuDetail.price || detail.price  }}元</div>
                    <div class="line"></div>
                    <div class="item-version clearfix" v-for="(item, saleAttrIndex) of detail.saleAttrs" :key="item.id">
                        <h2 style="font-weight: 500;">选择{{item.name}}</h2>
                        <div class="phone fl"
                            v-for="(saleAttrItem, index) of item.items"
                            :key="saleAttrItem.value"
                            :class="[{checked: activedMap[saleAttrIndex] === index, disabled: disabledMap[item.id + ':' + index]}]" @click="handleSaleAttrClick(item, saleAttrIndex, index)">
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
                        <span class="btn btn-large fl" @click="addToCart">加入购物车</span>
                        <span class="btn btn-large btn-buy fl" @click="buy">立即购买</span>
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
        for (let i=0; i<resp.data.saleAttrs.length; i++) {
            activedMap[i] = -1;
            const saleAttr = resp.data.saleAttrs[i];
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
         * 选择skuId，此时应该重新向后台请求数据；如果没有则取消高亮；如果全部销售属性都选中了的情况下（高亮），
         * （这个感觉做复杂了，可以考虑使用更简单的方式，比如说：每个属性始终必须选一个，没有取消选择的状态
         * @param currentSaleAttr 当前销售属性
         * @param currentSaleAttrIndex 当前销售属性的下标
         * @param currentIndex 当前销售属性的item的下标
         */
        handleSaleAttrClick(currentSaleAttr, currentSaleAttrIndex, currentIndex) {
            if (this.disabledMap[currentSaleAttr.id + ':' + currentIndex]) {
                return;
            }

            if (this.activedMap[currentSaleAttrIndex] === currentIndex) {
                this.activedMap[currentSaleAttrIndex] = -1;
            }
            else {
                this.activedMap[currentSaleAttrIndex] = currentIndex;
            }

            const skuIdMap = {}; // 存储已选择的属性的skuId，如果其他未选中的项的skuId未包含在其中，则禁用
            let times = 0;
            let checked = false;
            // key是saleAttrs的下标，value是saleAttr.items的下标
            for (const key in this.activedMap) {
                const value = this.activedMap[key];
                if (value !== -1) {
                    times++;
                    checked = true;
                    const saleAttr = this.detail.saleAttrs[key];
                    for (const skuId of saleAttr.items[value].skuIds.split(",")) {
                        if (skuIdMap[skuId]) {
                            skuIdMap[skuId]++;
                        }
                        else {
                            skuIdMap[skuId] = 1;
                        }
                    }
                }
            }
            let statistic = []; // 统计已经选择的出现次数大于times的skuId
            let target;
            if (checked) {
                for (const key in skuIdMap) {
                    if (skuIdMap[key] === times) {
                        statistic.push(key);
                    }
                    // 若某个选中的skuId出现的此时等于销售属性数据长度，则改skuId为目标对象
                    if (skuIdMap[key] === this.detail.saleAttrs.length) {
                        target = key;
                    }
                }
            }

            // 请求sku数据
            if (target) {
                this.getSkuDetail(target);
            }
            else {
                if (this.skuDetail.id) {
                    this.skuDetail = {};
                }
            }

            let outerIndex = 0;
            for (const saleAttr of this.detail.saleAttrs) {
                for (let i=0; i<saleAttr.items.length; i++) {
                    // 跳过当前选项
                    if (this.activedMap[outerIndex] === i) {
                        continue;
                    }

                    let disabled = false;
                    // 在选中了，而且选项大于1时，才进行禁用检查
                    if (checked && times > 1) {
                        if (statistic.length) {
                            const otherSkuIds = saleAttr.items[i].skuIds.split(",");
                            const result = getIntersection(statistic, otherSkuIds);
                            // console.log(statistic, otherSkuIds, "=====>", result);
                            if (!result.length) {
                                disabled = true;
                            }
                        }
                        else {
                            disabled = true;
                        }
                    }
                    
                    this.disabledMap[saleAttr.id + ':' + i] = disabled;
                }
                outerIndex++;
            }
        },

        // 目前还未考虑到商品数量，默认一个
        buy() {
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
            add(params).then(resp => {
                if (resp.code !== 0) {
                    return this.$message.warning("购买失败");
                }

                // 跳转至购物车界面【无法跳转】
                // 更新：如果是async函数的话，会有问题？
                // 更新，该问题还存在
                // 更新：好像是，页面开了多个页面后卡住的？
                // 更新：当该项目的浏览器tab超过两个，就会卡住
                this.$router.push({
                    path: "/cart"
                });
            });
        },
        addToCart() {
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
            add(params).then(resp => {
                if (resp.code !== 0) {
                    return this.$message.warning("添加失败");
                }
                return this.$message.warning("添加成功");
            });

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