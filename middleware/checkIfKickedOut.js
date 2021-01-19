export default function ({ app, store, route, redirect, next }) {
  let setup = false
  if (!setup) {
    app.router.afterEach((to, from) => {
      setup = true
      if (store.state.isLoggedIn && store.state.user?.isKickedOut) {
        redirect('/app/dashboard')
      }
    })
  }
}
