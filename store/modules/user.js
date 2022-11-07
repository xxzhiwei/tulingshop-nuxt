import jsCookie from 'js-cookie';

// let user = {
//     username: "",
//     avatar: ""
// };


const state = () => {
    // const accessToken = jsCookie.get("accessToken");
    // const refreshToken = jsCookie.get("refreshToken");
    // let _user = { ...user };
    // const userJson = jsCookie.get("user");

    // if (userJson) {
    //     _user = JSON.parse(userJson);
    // }

    return {
        refreshToken: "",
        accessToken: "",
        user: {}
    };
}

// const state = getDefaultState();

// 只能在client【浏览器端】下使用
const mutations = {
    SET_USER(state, info) {
        const { user } = info;
        state.user = user;
        let jsonStr = JSON.stringify(user);
        jsCookie.set("user", jsonStr, { expires: 365 });
    },
    SET_REFRESH_TOKEN(state, payload) {
        const { refreshToken } = payload;
        state.refreshToken = refreshToken;
        // localStorage.setItem("refreshToken", refreshToken);
        jsCookie.set("refreshToken", refreshToken, { expires: 365 });
    },
    SET_ACCESS_TOKEN(state, payload) {
        const { accessToken } = payload;
        state.accessToken = accessToken;
        // localStorage.setItem("accessToken", accessToken);
        jsCookie.set("accessToken", accessToken, { expires: 365 });
    }
};

const actions = {
    saveLoginInfo({ commit }, payload) {
        const { user, accessToken, refreshToken } = payload;
        commit("SET_USER", { user });
        commit("SET_ACCESS_TOKEN", { accessToken });
        commit("SET_REFRESH_TOKEN", { refreshToken });
    },
    logout({ commit }) {
        commit("SET_USER", { user: {} });
        commit("SET_ACCESS_TOKEN", { accessToken: "" });
        commit("SET_REFRESH_TOKEN", { refreshToken: "" });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
