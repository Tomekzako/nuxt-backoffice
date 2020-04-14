
export default function ({ store, error, redirect, route }) {
  if (!store.state.auth.tokenData) {
    return redirect('/login')
  }
}