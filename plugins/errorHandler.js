import axios from '@/plugins/axios'

export default ({
  app,
  store,
  redirect,
  error
}) => {

  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (e) {

      if (e.response) {
        switch (e.response.status) {
          case 500:
            error({statusCode: 500})
            break
          case 404:
            error({statusCode: 404})
            break
          case 403:
            error({statusCode: 403})
            break
          case 401:
            console.log(store.state.auth.tokenData);
            //#TODO
            if (!store.state.auth.tokenData) {
              redirect('/login')
            } else {
              error({statusCode: 401})
            }
            break
          case 409:

            const snackbar = {
              text: app.i18n.t('errors.conflictSaveNotification'),
              color: 'error'
            }

            store.commit('snackbar/showSnackbar', snackbar)

            break
          default:
            break
        }
      }

      //global trackig api errors
      app.$sentry.captureException(e);      

      return Promise.reject(e);
    }
  )
  
}