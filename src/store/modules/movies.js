import moviesAPI from '../../services/moviesApi';

const SET_SEARCH = 'SET_SEARCH';
const SET_FILTER = 'SET_FILTER';
const ADD_MOVIE = 'ADD_MOVIE';
const DELETE_MOVIE = 'DELETE_MOVIE';
const UPDATE_MOVIE = 'UPDATE_MOVIE';
const SET_MOVIES = 'SET_MOVIES';

const state = {
    movies: [],
    search: '',
    filter: {
        key: 'rating',
        order: 'desc'
    }
};

const mutations = {
    [SET_SEARCH](state, search) {
        state.search = search;
    },
    [SET_FILTER](state, filter) {
        state.filter = filter;
    },
    [ADD_MOVIE](state, newMovie) {
        newMovie.id = state.movies.length + 1;
        state.movies.push(newMovie);
    },
    [DELETE_MOVIE](state, movieID) {
        state.movies = state.movies.filter(movie => movie.id !== movieID);
    },
    [UPDATE_MOVIE](state, movieUpdated) {
        state.movies = state.movies.filter(movie =>
            movie.id === movieUpdated.id ? movieUpdated : movie
        );
    },
    [SET_MOVIES](state, movies) {
        state.movies = movies;
    }
};

const actions = {
    search({ commit }, search) {
        commit(SET_SEARCH, search);
    },
    filter({ commit }, filter) {
        commit(SET_FILTER, filter);
    },
    addMovie({ commit }, newMovie) {
        moviesAPI
            .addMovie(newMovie)
            .then(res => commit(ADD_MOVIE, res))
            .catch(error => console.log(error));
    },
    deleteMovie({ commit }, movieID) {
        moviesAPI
            .deleteMovie(movieID)
            .then(res => commit(DELETE_MOVIE, res))
            .catch(err => console.log(err));
    },
    updateMovie({ commit }, movie) {
        moviesAPI
            .updateMovie(movie)
            .then(res => {
                commit(UPDATE_MOVIE, res);
                return;
            })
            .catch(error => console.log(error));
    },
    fetchMovies({ commit }) {
        moviesAPI
            .getMovies()
            .then(res => commit(SET_MOVIES, res))
            .catch(error => console.log(error));
    }
};

const getters = {
    getMovies: state => {
        return state.movies
            .filter(
                movie =>
                    movie.name
                        .toLowerCase()
                        .indexOf(state.search.toLowerCase()) > -1
            )
            .sort(compare(state.filter));
    },
    getMovieById: state => id => {
        return state.movies.find(movie => movie.id === id);
    }
};

const compare = ({ key, order }) => {
    return (a, b) => {
        let result = 0;
        if (a[key] > b[key]) {
            result = 1;
        }
        if (a[key] < b[key]) {
            result = -1;
        }

        if (order === 'asc') return result;

        return result * -1;
    };
};

export default {
    state,
    mutations,
    actions,
    getters
};
