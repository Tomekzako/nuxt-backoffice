export default function ({
  store
}) {
  return store.dispatch('user/getUser')
}