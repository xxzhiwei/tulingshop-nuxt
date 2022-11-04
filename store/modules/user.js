let user = {
    username: "",
    avatar: ""
};


const state = () => {
    if (!process.client) {
        return {
            refreshToken: "",
            accessToken: "",
            name: "",
            avatar: "",
            user: user
        };
    }
    // 客户端时，再次初始化数据
    const accessToken = window.localStorage.getItem("accessToken");
    const refreshToken = window.localStorage.getItem("refreshToken");
    const userJson = window.localStorage.getItem("user");
    if (userJson) {
        user = JSON.parse(userJson);
    }
    return {
        refreshToken: refreshToken,
        accessToken: accessToken,
        name: user.username,
        avatar: user.avatar,
        user: user
    };
}

// const state = getDefaultState();

// 只能在client【浏览器端】下使用
const mutations = {
    SET_USER(state, info) {
        const { user } = info;
        state.user = user;
        state.name = user.username;
        state.avatar = user.avatar;
        localStorage.setItem("user", JSON.stringify(user));
    },
    SET_REFRESH_TOKEN(state, payload) {
        const { refreshToken } = payload;
        state.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
    },
    SET_ACCESS_TOKEN(state, payload) {
        const { accessToken } = payload;
        state.accessToken = accessToken;
        localStorage.setItem("accessToken", accessToken);
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
        commit("SET_USER", { user: user });
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
