import { createStore } from "vuex";

// Crea una nuova istanza dello store.
const store = createStore({
  state() {
    return {
      nome: "",
      cognome: "",
      email: "",
      nr_telefono: "",
      ruolo: "",
      token: "",
      isLoggedIn: false, // Aggiunto nuovo campo per indicare se l'utente è loggato
    };
  },
  mutations: {
    setToken(state, payload) {
      state.nome = payload.nome;
      state.email = payload.email;
      state.nr_telefono = payload.nr_telefono;
      state.ruolo = payload.ruolo;
      state.token = payload.token;
      state.isLoggedIn = true; // Imposta isLoggedIn a true quando l'utente effettua il login

      // Salva le informazioni di login in localStorage
      localStorage.setItem("loginInfo", JSON.stringify(payload));
    },
    clearToken(state) {
      state.nome = "";
      state.email = "";
      state.token = "";
      state.isLoggedIn = false; // Imposta isLoggedIn a false quando l'utente effettua il logout

      // Rimuovi le informazioni di login da localStorage
      localStorage.removeItem("loginInfo");
    },
  },
  actions: {
    initializeStore({ commit }) {
      const loginInfo = localStorage.getItem("loginInfo");
      if (loginInfo) {
        const { nome, cognome, email, nr_telefono, token } =
          JSON.parse(loginInfo);
        commit("setToken", { nome, cognome, email, nr_telefono, token });
      }
    },
  },
  getters: {
    getToken: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.nome;
    },
    getEmail: (state) => {
      return state.email;
    },
    getTelefono: (state) => {
      return state.nr_telefono;
    },
    getRuolo: (state) => {
      return state.ruolo;
    },
    isLoggedIn: (state) => {
      return state.isLoggedIn; // Getter per verificare se l'utente è loggato
    },
  },
});

store.dispatch("initializeStore");

export default store;
