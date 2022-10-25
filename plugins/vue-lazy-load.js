import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';

Vue.use(VueLazyLoad, {
    loading: '/imgs/loading-svg/loading-bars.svg',
    error: '/imgs/nopic.png'
});