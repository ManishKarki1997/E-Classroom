export default function ({ store, redirect }) {
  if (store.state.user.userType === 'ADMIN') {
    return redirect('/app/admin/dashboard')
  }
}
