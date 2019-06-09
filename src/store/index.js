import Vue from 'vue';
import Vuex from 'vuex';

import global from './modules/global'
import auth from './modules/auth'

Vue.use(Vuex);


const store = new Vuex.Store({
    modules: {
        global,
        auth,
    }
});
 
export default store;