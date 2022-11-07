import Vuex from 'vuex';
import user from './modules/user';
import { parseCookies, parseJson } from "@/utils/common";

// nuxtjs自动创建时，规则和以下不同；（自动创建时，命名空间无法识别）
const createStore = () => {
    return new Vuex.Store({
        modules: {
            // app,
            // settings,
            user,
            // permission
        },
        // getters

        actions: {
            // 由于服务端没有localStorage，现在只能使用cookie；并且使用cookie保存json数据，再转为对象时，还需要手动处理；
            // 如果有好的处理方法，望告知。。
            nuxtServerInit({ dispatch }, { req }) {
                console.log("nuxtServerInit --> ")

                const cookies = parseCookies(req.headers.cookie);
                const payload = {
                    refreshToken: cookies.refreshToken,
                    accessToken: cookies.accessToken,
                    user: cookies.user ? JSON.parse(parseJson(cookies.user)) : {}
                }
                dispatch('user/saveLoginInfo', payload);
                console.log("<---")
            },
        }
    });
}

export default createStore;
