import colors from 'vuetify/es5/util/colors'
import bodyParser from 'body-parser'
import session from 'express-session'

/* App version import */
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0
// version przekazywana jest do zmiennej środowiskowej: env.appVersion
/* App version import */

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700&display=swap&subset=latin-ext'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#448aff'
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/styles/_main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '~/plugins/i18n.js'
    },
    {
      src: '~/plugins/ability.js'
    },
    {
      src: '~/plugins/errorHandler.js'
    },
    {
      src: '~/plugins/vue-the-mask.js'
    },
    {
      src: '@/plugins/vue-mavon-editor',
      ssr: false
    },
    {
      src: '@/plugins/vue-the-mask'
    }
  ],
  router: {
    //middleware: ['']
  },
  server: {
    port: 3003
  },
  serverMiddleware: [
    bodyParser.json(),
    session({
      secret: '54E3#ed%ggnui87^543fvbssDdsdsq!qcbuop7GgbcDf56G',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60 * 6 * 10000 }
    }),
    '~/api'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/sentry',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit'
  ],
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: false,
    injected: true
  },
  /*
   ** Axios module configuration
   */
  sentry: {
    dsn: 'https://3744e3a7931a435ea04f3b60a3d4c3a8@sentry.io/5175776', // Enter your project's DSN here
    config: {} // Additional config
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['@/assets/styles/_variables.scss'],
    optionsPath: './vuetify.options.js',
    treeShake: true,
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#66BB6A',
          secondary: '#2C303B',
          accent: '#448AFF',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  env: {
    appVersion: version
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
