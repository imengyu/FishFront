const state = {

    //Footer and headers
    globalFooterShow: true,
    globalHeaderShow: true,
    globalHeaderColWidth: null,
    globalHeaderStyle: 'header-minimum',
    globalHeaderMenuStyle: 'main-menu-white',
    globalHeaderRowClass: '',
    globalFooterStyle: 'normal',
    globalPageBackgroundImage: null,
    globalPageBackgroundOverlay: true,
    globalPageShowBreadcrumb: false,
    globalPageBreadcrumb: null,
    globalPageBackgroundOverlayOpactity: '.2',
    globalAdminPanel: false,
    globalAdminCollape: false,
};
const getters = {
    footerShow(state) { return state.globalFooterShow },
    footerStyle(state) { return state.globalFooterStyle },
    headerShow(state) { return state.globalFooterShow },
    headerStyle(state) { return state.globalHeaderStyle },
    headerMenuStyle(state) { return state.globalHeaderMenuStyle },
    headerColWidth(state) { return state.globalHeaderColWidth },
    headerRowClass(state) { return state.globalHeaderRowClass },
    pageBackgroundImage(state) { return state.globalPageBackgroundImage },
    pageBackgroundOverlay(state) { return state.globalPageBackgroundOverlay },
    pageShowBreadcrumb(state) { return state.globalPageShowBreadcrumb },
    pageBreadcrumb(state) { return state.globalPageBreadcrumb },
    pageBackgroundOverlayOpactity(state) { return state.globalPageBackgroundOverlayOpactity },
    adminPanel(state) { return state.globalAdminPanel },
    adminCollape(state) { return state.globalAdminCollape },
};
const mutations = {
    switchFooter(state, show) { state.globalFooterShow = show; },
    setFooterStyle(state, style) { state.globalFooterStyle = style; },
    switchHeader(state, show) { state.globalFooterShow = show; },
    setHeaderStyle(state, style) { state.globalHeaderStyle = style; },
    setHeaderMenuStyle(state, style) { state.globalHeaderMenuStyle = style; },
    setHeaderColWidth(state, style) { return state.globalHeaderColWidth = style; },
    setHeaderRowClass(state, style) { return state.globalHeaderRowClass = style; },
    setPageBackgroundImage(state, image) { state.globalPageBackgroundImage = image; },
    setPageBackgroundOverlay(state, show) { state.globalPageBackgroundOverlay = show; },
    setPageShowBreadcrumb(state, show) { state.globalPageShowBreadcrumb = show; },
    setPageBreadcrumb(state, breadcrumb) { state.globalPageBreadcrumb = breadcrumb; },
    setPageBackgroundOverlayOpactity(state, op) { state.globalPageBackgroundOverlayOpactity = op; },
    setAdminPanel(state, is) { state.globalAdminPanel = is; },
    setAdminCollape(state, collape) { state.globalAdminCollape = collape; },
    switchAdminCollape(state) { state.globalAdminCollape = !state.globalAdminCollape; },
};
const actions = {

    switchFooter(context, show) { context.commit('switchFooter', show); },
    setFooterStyle(context, style) { context.commit('setFooterStyle', style); },
    switchHeader(context, show) { context.commit('switchHeader', show); },
    setHeaderStyle(context, style) { context.commit('setHeaderStyle', style); },
    setHeaderMenuStyle(context, style) { context.commit('setHeaderMenuStyle', style); },
    setPageBackgroundImage(context, image) { context.commit('setPageBackgroundImage', image); },
    setPageBackgroundOverlay(context, show) { context.commit('setPageBackgroundOverlay', show);  },
    setPageShowBreadcrumb(context, show) { context.commit('setPageShowBreadcrumb', show);  },
    setPageBreadcrumb(context, breadcrumb) { context.commit('setPageBreadcrumb', breadcrumb);  },
    setPageBackgroundOverlayOpactity(context, op) { context.commit('setPageBackgroundOverlayOpactity', op); },
    setAdminCollape(state, collape) { state.commit('setAdminCollape', collape); },
    setAdminPanel(context, is) { context.commit('setAdminPanel', is); },
    setHeaderColWidth(context, is) { context.commit('setHeaderColWidth', is); },
    setHeaderRowClass(context, is) { context.commit('setHeaderRowClass', is); },
    resetHeader(context){
        context.commit('switchFooter', true);
        context.commit('switchHeader', true);
        context.commit('setFooterStyle', 'normal');
        context.commit('setHeaderStyle', 'header-minimum');
        context.commit('setHeaderMenuStyle', 'main-menu-white');
        context.commit('setPageBackgroundImage', null);
        context.commit('setPageShowBreadcrumb', false);
        context.commit('setAdminPanel', false);
        context.commit('setHeaderColWidth', null);
        context.commit('setHeaderRowClass', '');
    },
    switchAdminCollape(context){
        context.commit('switchAdminCollape');
    },
};

export default {
    namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
    state,
    getters,
    mutations,
    actions
}