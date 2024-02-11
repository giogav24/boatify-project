import { createStore } from 'vuex'

// Crea una nuova istanza dello store.
const store = createStore({
  state() {
    return {
      user: "",
      email: "",
      token: ""
    }
  },
  mutations: {
    // payload: { user: {}, email: "", token: "" }
    setToken(state, payload) {
      state.user = payload.user;
      state.email = payload.email;
      state.token = payload.token;

      // Salva le informazioni di login in localStorage
      localStorage.setItem('loginInfo', JSON.stringify(payload));
    },
    // Cancella le informazioni di login
    clearToken(state) {
      state.user = "";
      state.email = "";
      state.token = "";

      // Rimuovi le informazioni di login da localStorage
      localStorage.removeItem('loginInfo');
    },
  },
  actions: {
    // Azione per inizializzare lo store con le informazioni di login da localStorage
    initializeStore({ commit }) {
      const loginInfo = localStorage.getItem('loginInfo');
      if (loginInfo) {
        const { user, email, token } = JSON.parse(loginInfo);
        commit('setToken', { user, email, token });
      }
    },
  },
  getters: {
    getToken: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
    getEmail: state => {
      return state.email;
    },
  }
});

// Inizializza lo store quando l'applicazione parte
store.dispatch('initializeStore');

export default store;