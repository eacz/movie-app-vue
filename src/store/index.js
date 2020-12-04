import { createStore } from 'vuex';
import movies from './modules/movies'

export default createStore({
    state: {
        user: {}
    },
    mutations: {
        //mutations have to be synchronous
    },
    actions: {
        //actions can be sync or async
    },
    modules: {
		movies
	},
    getters: {}
});
