import { createStore } from "vuex";

// Crea una nuova istanza dello store.
const store = createStore({
  state() {
    return {
      user: "",
      email: "",
      token: "",
      isLoggedIn: false, // Aggiunto nuovo campo per indicare se l'utente è loggato
    };
  },
  mutations: {
    setToken(state, payload) {
      state.user = payload.user;
      state.email = payload.email;
      state.token = payload.token;
      state.isLoggedIn = true; // Imposta isLoggedIn a true quando l'utente effettua il login

      // Salva le informazioni di login in localStorage
      localStorage.setItem("loginInfo", JSON.stringify(payload));
    },
    clearToken(state) {
      state.user = "";
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
        const { user, email, token } = JSON.parse(loginInfo);
        commit("setToken", { user, email, token });
      }
    },
    // Aggiungi altre azioni se necessario
  },
  getters: {
    getToken: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.user;
    },
    getEmail: (state) => {
      return state.email;
    },
    isLoggedIn: (state) => {
      return state.isLoggedIn; // Getter per verificare se l'utente è loggato
    },
    // Aggiungi altri getter se necessario
  },
});

// Inizializza lo store quando l'applicazione parte
store.dispatch("initializeStore");

export default store;
