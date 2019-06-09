const state = {
    authAuthed: false,
    authAuthInfo: null
};
const getters = {
    authed(state) { return state.authAuthed },
    authInfo(state) { return state.authAuthInfo },
};
const mutations = {
    setAuthed(state, authed) { state.authAuthed = authed; },
    setAuthInfo(state, info) { state.authAuthInfo = info; },
};
const actions = {
    setAuthed(context, authed) { context.commit('setAuthed', authed); },
    setAuthInfo(context, info) { context.commit('setAuthInfo', info); },
};

export default {
    namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
    state,
    getters,
    mutations,
    actions
}