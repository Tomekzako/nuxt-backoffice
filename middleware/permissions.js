export default function ({
  store,
  error,
  redirect,
  route,
  app
}) {

  //jeżeli strona główna nie sprawdzamy uprawnień
  if(route.name !== 'index') {
    
    const permissions = [].concat(...route.matched.map((r) => {
      return (r.components.default.options ? r.components.default.options.permissions : null) 
    }))
    
    if (typeof permissions[0] !== 'undefined') {
      if (app.$can(permissions[0], permissions[1]) === false) {
        throw ({
          statusCode: 403
        })
      }
    }
  }
}