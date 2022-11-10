<template>
    <div class="index">
        <div class="container">
            <div class="swiper-box">
                <div class="nav-menu">
                    <ul class="menu-wrap">
                        <!-- <li class="menu-item">
                            <a href="javascript:;">手机 电话卡</a>
                            <div class="children">
                                <ul v-for="(item,i) in menuList" v-bind:key="i">
                                    <li v-for="(sub,j) in item" v-bind:key="j">
                                        <a v-bind:href="sub?'/#/product/'+sub.id:''">
                                            <img src="/imgs/item-box-1.png" alt="">
                                            {{sub?sub.name:'小米9'}}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li> -->

                        <!-- 还可以建立另外一张表，结构与分类一致 -->
                        <li class="menu-item" v-for="item in categoryList" v-bind:key="item.id">
                            <a href="javascript:;">{{ item.name }}</a>
                            <div class="children" v-if="item.children">
                                <ul>
                                    <li v-for="(item1) in item.children" v-bind:key="item1.id">
                                        <a v-bind:href="'/search?keywords=' + (item1.keywords ? item1.keywords : '全部商品')" target="_blank">
                                            {{item1.name}}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-swiper:mySwiper="swiperOption">
                    <div class="swiper-wrapper">
                        <div
                            v-for="banner in banners"
                            :key="banner.id"
                            class="swiper-slide"
                            style="background: #040b1b"
                        >
                            <a target="_blank" :href="banner.linkUrl">
                                <img :src="banner.imageUrl" :alt="banner.title" />
                            </a>
                        </div>
                    </div>
                    <div class="swiper-pagination swiper-pagination-white"></div>
                    <div
                        class="swiper-button-prev swiper-button-white"
                        slot="button-prev"
                    ></div>
                    <div
                        class="swiper-button-next swiper-button-white"
                        slot="button-next"
                    ></div>
                </div>
            </div>
            <div class="tulingAdsbox">
                <a v-bind:href="'/#/product/'+item.id" v-for="(item,index) in adsList" v-bind:key="index">
                    <img :src="item.imageUrl" alt="">
                </a>
            </div>
            <div class="banner">
                <a href="/#/product/30">
                    <img src="/imgs/banner-1.png" alt="">
                </a>
            </div>
        </div>
        <div class="product-box">
            <div class="container">
                <h2>手机</h2>
                <div class="wrapper">
                    <div class="banner-left">
                        <a href="/#/product/35"><img src="/imgs/mix-alpha.jpg" alt=""></a>
                    </div>
                    <div class="list-box">
                        <div class="list" v-for="(arr,i) in phoneList" v-bind:key="i">
                            <div class="item" v-for="(item,j) in arr" v-bind:key="j">
                                <span v-bind:class="{'new-pro':j%2==0}">新品</span>
                                <div class="item-img">
                                    <img src="'/imgs/mix-alpha.jpg'" alt="">
                                </div>
                                <div class="item-info">
                                    <h3>{{item.name}}</h3>
                                    <p>{{item.subtitle}}</p>
                                    <p class="price">{{item.price}}元</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="product-box">
            <div class="container">
                <h2>秒杀</h2>
                <div class="wrapper">
                    <div class="banner-left">
                        <a href="/#/product/35"><img src="/imgs/mix-alpha.jpg" alt=""></a>
                    </div>
                    <div class="list-box">
                        <div class="list" v-for="(arr,i) in flashpromotion" v-bind:key="i">
                            <div class="item" v-for="(item,j) in arr" v-bind:key="j">
                                <span v-bind:class="{'new-pro':true}">秒杀</span>
                                <div class="item-img">
                                    <img src="'/imgs/mix-alpha.jpg'" alt="">
                                </div>
                                <div class="item-info">
                                    <h3>{{item.name}}</h3>
                                    <p>{{item.subtitle}}</p>
                                    <p class="price">{{item.price}}元,<a v-bind:href="item?'/#/product/'+item.id:''">立即抢购</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <service-bar></service-bar>
    </div>
</template>
<script>
import ServiceBar from "@/components/ServiceBar";
import Modal from "@/components/Modal";

import { getAggregation } from "@/api/index";

const pb1 = require("@/assets/product-bg-1.png");
const pb3 = require("@/assets/product-bg-3.png");

// 会被adblock拦截
const ad1 = require("@/assets/ads/ad-1.jpeg");
const ad2 = require("@/assets/ads/ad-2.jpeg");
const ad3 = require("@/assets/ads/ad-3.jpeg");

export default {
    layout: "main-template",
    name: "index",
    components: {
        // swiper,
        // swiperSlide,
        ServiceBar,
        Modal,
    },
    async asyncData() {
        const resp = await getAggregation();
        if (resp.code !== 0) {
            throw new Error("获取数据失败");
        }
        const { categoryList } = resp.data;

        return {
            swiperOption: {
                autoplay: {
                    delay: 4000
                },
                loop: true,
                effect: "fade",
                fadeEffect: {
                    crossFade: true
                },
                // cubeEffect: {
                //     shadowOffset: 100,
                //     shadowScale: 0.6,
                // },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            },
            banners: [{
                id: 1,
                imageUrl: pb1,
                title: '1',
                linkUrl: 'http://www.baidu.com'
            }, {
                id: 2,
                imageUrl: pb3,
                title: '2',
                linkUrl: 'http://www.baidu.com'
            }, {
                id: 3,
                imageUrl: pb1,
                title: '3',
                linkUrl: 'http://www.baidu.com'
            }, {
                id: 4,
                imageUrl: pb3,
                title: '4',
                linkUrl: 'http://www.baidu.com'
            }],
            adsList: [{
                id: 1,
                imageUrl: ad1,
                title: 'ad1',
                linkUrl: 'http://www.baidu.com'
            }, {
                id: 2,
                imageUrl: ad2,
                title: 'ad2',
                linkUrl: 'http://www.baidu.com'
            }, {
                id: 3,
                imageUrl: ad3,
                title: 'ad3',
                linkUrl: 'http://www.baidu.com'
            }],
            phoneList: [],
            flashpromotion: [],
            categoryList
        };
    },
    methods: {
        // async getAggregation() {
        //     const resp = await getAggregation();
        //     if (resp.code !== 0) {
        //         throw new Error("获取数据失败");
        //     }
        //     const { categoryList } = resp.data;
        //     this.categoryList = categoryList;
        // },
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/config.scss";
@import "@/assets/scss/mixin.scss";
.index {
    .swiper-box {
        .nav-menu {
            position: absolute;
            width: 264px;
            height: 451px;
            z-index: 9;
            padding: 26px 0;
            background-color: #55585a7a;
            box-sizing: border-box;
            .menu-wrap {
                .menu-item {
                    height: 50px;
                    line-height: 50px;
                    a {
                        position: relative;
                        display: block;
                        font-size: 16px;
                        color: #ffffff;
                        padding-left: 30px;
                        &:after {
                            position: absolute;
                            right: 30px;
                            top: 17.5px;
                            content: " ";
                            @include bgImg(10px, 15px, "/imgs/icon-arrow.png");
                        }
                    }
                    &:hover {
                        background-color: $colorA;
                        .children {
                            display: block;
                        }
                    }
                    .children {
                        display: none;
                        width: 962px;
                        height: 451px;
                        background-color: $colorG;
                        position: absolute;
                        top: 0;
                        left: 264px;
                        border: 1px solid $colorH;
                        ul {
                            display: flex;
                            // justify-content: space-between;
                            flex-wrap: wrap;
                            height: 75px;
                            li {
                                height: 75px;
                                line-height: 75px;
                                // flex: 1;
                                width: 120px;
                                padding-left: 23px;
                            }
                            a {
                                color: $colorB;
                                font-size: 14px;
                            }
                            img {
                                width: 42px;
                                height: 35px;
                                vertical-align: middle;
                                margin-right: 15px;
                            }
                        }
                    }
                }
            }
        }
        .swiper-container {
            height: 451px;
            .swiper-button-prev {
                left: 274px;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    // 被adblock拦截了
    .tulingAdsbox {
        @include flex();
        margin-top: 14px;
        margin-bottom: 14px;
        justify-content: normal;
        a {
            width: 296px;
            height: 167px;
        }
        a:not(:first-child) {
            margin-left: 14px;
        }
    }
    .banner {
        margin-bottom: 28px;
    }
    .product-box {
        background-color: $colorJ;
        padding: 30px 0 50px;
        h2 {
            font-size: $fontF;
            height: 21px;
            line-height: 21px;
            color: $colorB;
            margin-bottom: 20px;
        }
        .wrapper {
            display: flex;
            .banner-left {
                margin-right: 16px;
                img {
                    width: 224px;
                    height: 619px;
                }
            }
            .list-box {
                .list {
                    @include flex();
                    width: 986px;
                    margin-bottom: 14px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .item {
                        width: 236px;
                        height: 302px;
                        background-color: $colorG;
                        text-align: center;
                        span {
                            display: inline-block;
                            width: 67px;
                            height: 24px;
                            font-size: 14px;
                            line-height: 24px;
                            color: $colorG;
                            &.new-pro {
                                background-color: #7ecf68;
                            }
                            &.kill-pro {
                                background-color: #e82626;
                            }
                        }
                        .item-img {
                            img {
                                width: 100%;
                                height: 195px;
                            }
                        }
                        .item-info {
                            h3 {
                                font-size: $fontJ;
                                color: $colorB;
                                line-height: $fontJ;
                                font-weight: bold;
                            }
                            p {
                                color: $colorD;
                                line-height: 13px;
                                margin: 6px auto 13px;
                            }
                            .price {
                                color: #f20a0a;
                                font-size: $fontJ;
                                font-weight: bold;
                                cursor: pointer;
                                &:after {
                                    @include bgImg(
                                        22px,
                                        22px,
                                        "/imgs/icon-cart-hover.png"
                                    );
                                    content: " ";
                                    margin-left: 5px;
                                    vertical-align: middle;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>