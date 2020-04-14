import rules from '@/permissions/rules'

export default ({
  app
}, inject) => {

  inject('can', (subject, action) => {

    const user = app.store.state.user.user

    if (user) {
      if (user.group.name === "super admin") {
        return true
      } else {
        return checkPermission(subject, action)
      }
    }

    function checkPermission(subject, action) {
      let permissions = user.group.permissions
      for(let el in permissions) {
        if (el === subject) {
          return permissions[el].some(el => el.action === action)
        }
      }
      return false
    }


    return false
  })
}