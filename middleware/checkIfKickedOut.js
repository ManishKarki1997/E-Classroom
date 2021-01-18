export default function ({ app, store, route, redirect }) {
  let setup = false
  if (!setup) {
    app.router.afterEach((to, from, next) => {
      setup = true
      if (store.state.isLoggedIn && store.state.user.isKickedOut) {
        redirect('/app/dashboard')
      }
    })
  }
}
