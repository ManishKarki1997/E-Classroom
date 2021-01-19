export default function ({ store, redirect, next, app }) {
  if (store.state.user?.userType === 'ADMIN') {
    return redirect('/app/admin/dashboard')
  }
}
