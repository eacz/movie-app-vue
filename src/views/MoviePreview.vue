<template>
    <div id="movie-preview">
        <Navbar />
        
        <div id="movie-container">
            <div id="movie-poster"><Spinner v-if="Object.keys(movie).length < 1" />
                <img :src="movie.poster" alt="movie poster" />
            </div>

            <div id="movie-info">
                <h1>{{ movie.name }}</h1>
                <h3>{{ movie.year }}</h3>
                <h3>{{ movie.genre }}</h3>
                <h3>
                    <span
                        id="movie-rating"
                        :style="{ 'background-color': getRatingColor() }"
                        >{{ movie.rating }}</span
                    >
                </h3>
                <h3>Budget: {{ movie.budget }}</h3>
                <h3>Box office: {{ movie.boxOffice }}</h3>
                <h3>
                    Actors:
                    <span v-for="(actor, index) in movie.actors" :key="index">{{
                        actor.name
                    }}</span>
                </h3>
                <h3><strong>Storyline: </strong>{{ movie.storyline }}</h3>
                <div id="options">
                    <button class="edit" @click="showModal = true">Edit</button>
                    <button class="delete" @click="deleteMovie">Delete</button>
                </div>
            </div>
        </div>
        <modal v-if="showModal" @close="showModal = !showModal">
            <template v-slot:header>
                <h3 class="m-0">Create new movie</h3>
            </template>
            <template v-slot:body>
                <form
                    @submit.prevent="updateMovie"
                    ref="movieForm"
                    id="movie-form"
                >
                    <p>Fill out the details bellow</p>
                    <input
                        required
                        v-model="movie.name"
                        type="text"
                        placeholder="Name"
                    />
                    <input
                        required
                        v-model="movie.year"
                        type="number"
                        placeholder="Year"
                    />
                    <input
                        required
                        v-model="movie.rating"
                        type="number"
                        placeholder="Rating"
                    />
                    <input
                        required
                        v-model="movie.genre"
                        type="text"
                        placeholder="Genre"
                    />
                    <input
                        required
                        v-model="movie.budget"
                        type="text"
                        placeholder="Budget"
                    />
                    <input
                        required
                        v-model="movie.boxOffice"
                        type="text"
                        placeholder="Box Office"
                    />
                    <input
                        required
                        v-model="movie.poster"
                        type="text"
                        placeholder="Poster"
                    />
                    <hr />
                    <div>
                        <div id="actor-input">
                            <p class="m-0">Actors</p>
                            <span @click="addActor" class="add-actor">+</span>
                        </div>

                        <input
                            required
                            v-for="(actor, index) in movie.actors"
                            :key="index"
                            v-model="movie.actors[index].name"
                            type="text"
                            placeholder="Actor"
                        />
                    </div>

                    <hr />

                    <textarea
                        required
                        v-model="movie.storyline"
                        placeholder="Storyline"
                        rows="6"
                    />
                </form>
            </template>
            <template v-slot:footer>
                <button
                    id="add-movie"
                    class="edit-modal"
                    @click="$refs.movieForm.requestSubmit()"
                >
                    Save
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ratingMixin from '../mixins/getRatingColor';
import Spinner from '@/components/Spinner'

import moviesAPI from '../services/moviesApi';
export default {
    components: { Navbar, Modal, Spinner },
    mixins: [ratingMixin],
    props: {
        id: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            movie: {},
            showModal: false
        };
    },
    methods: {
        deleteMovie() {
            this.$store
                .dispatch('deleteMovie', this.id)
                .then(res => this.$router.push('/'));x
        },
        updateMovie() {
            this.$store.dispatch('updateMovie', this.movie);
            this.showModal = false;
        }
    },
    created() {
        const movie = this.$store.getters.getMovieById(parseInt(this.id));
        if (movie) {
            this.movie = movie;
        } else {
            moviesAPI
                .getMovieByID(this.id)
                .then(res => (this.movie = res))
                .catch(error => console.log(error));
        }
    }
};
</script>

<style lang="scss" scoped>
#movie-preview {
    display: flex;
    overflow: auto;

    #movie-container {
        display: flex;
        justify-content: center;
        flex-grow: 1;
        margin-top: 90px;
        padding: 0 1rem;

        #movie-poster {
            flex-grow: 1;
            min-width: 400px;

            img {
                max-width: 300px;
                box-shadow: 0 14px 28px rgba(0, 0, 0, 0.473),
                    0 10px 10px rgba(0, 0, 0, 0.473);
                margin-bottom: 7px;
                border-radius: 15px;
            }
        }

        #movie-info {
            display: flex;
            flex-grow: 2;
            text-align: left;
            flex-direction: column;
            justify-content: space-between;

            h1 {
                color: white;
                margin-bottom: 2rem;
            }

            h3 {
                color: rgb(143, 143, 143);

                #movie-rating {
                    display: flex;
                    justify-content: center;
                    border-radius: 10px;
                    font-size: 20px;
                    width: 53px;
                    color: white;
                }

                span {
                    margin-right: 5px;
                }
            }

            #options {
                max-width: 180px;
                display: flex;
                justify-content: space-between;
                margin-top: 1rem;

                .edit {
                    height: 30px;
                    width: 80px;
                    background-color: #5eb85e;
                    color: #e1e1e1;
                    border: none;
                    text-transform: uppercase;
                    font-weight: 600;
                    border-radius: 10px;
                    outline: none;
                    cursor: pointer;
                }

                .delete {
                    height: 30px;
                    width: 80px;
                    background-color: #e10505;
                    color: #e1e1e1;
                    border: none;
                    text-transform: uppercase;
                    font-weight: 600;
                    border-radius: 10px;
                    outline: none;
                    cursor: pointer;
                }
            }
        }
    }

    #movie-form {
        display: flex;
        flex-direction: column;
        text-align: left;

        & > div {
            display: flex;
            flex-direction: column;

            #actor-input {
                display: flex;
                justify-content: space-between;
            }
        }

        .add-actor {
            background-color: green;
            text-align: center;
            color: white;
            margin-left: 5px;
            height: 100%;
            padding: 2px 10px;
            font-size: 20px;
            padding: 1re;
            align-self: center;
            cursor: pointer;
        }
    }

    #update-movie {
        background-color: #5eb85e;
        border: none;
        padding: 5px;
        width: 70px;
        color: white;
        border-radius: 10px;
        cursor: pointer;
        text-transform: uppercase;
        outline: none;
    }
    .edit-modal {
        background-color: #5eb85e;
        border: none;
        padding: 5px;
        width: 70px;
        color: white;
        border-radius: 10px;
        cursor: pointer;
        text-transform: uppercase;
        outline: none;
        font-weight: 600;
    }
}
</style>
