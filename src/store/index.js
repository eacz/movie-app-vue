import { createStore } from 'vuex';
import movies from './modules/movies'

const SET_USER = 'SET_USER';

export default createStore({
    state: {
        user: {}
    },
    mutations: {
        //mutations have to be syncrhonoues
    },
    actions: {
        //actions can be sync or async
    },
    modules: {
		movies
	},
    getters: {}
});
