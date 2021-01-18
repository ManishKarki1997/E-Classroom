export default function ({ store, redirect, route }) {
  if (route.matched.some((s) => s.name === 'app') && !store.state.isLoggedIn) {
    return redirect('/login')
  }
}
