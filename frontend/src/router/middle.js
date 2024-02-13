import store from "../store";

export default function auth(to, from, next) {
  if (!store.state.token) {
    next({ name: "login" });
  } else {
    next();
  }
}

/*
export default function roleProprietaria(to, from, next) {
    if(store.state.user.ruolo !== 'Proprietaria' || store.state.user.locale !== from.params.localeID){
        next({name: 'error403'})
    } else next()
}

export default function role(to, from, next) {
    if(store.state.user.ruolo !== 'Proprietaria' || store.state.user.locale !== from.params.localeID){
        next({name: 'error403'})
    } else next()
}*/
