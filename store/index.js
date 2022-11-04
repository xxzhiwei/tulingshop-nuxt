import Vuex from 'vuex';
import user from './modules/user';

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
    });
}

export default createStore;
