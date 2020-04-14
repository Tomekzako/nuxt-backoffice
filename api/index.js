import express from 'express'
import axios from './../plugins/axios'

const cors = require('cors')
const request = require('request')
const router = express.Router()
const childProcess = require('child_process')

const app = express()
app.use(cors())

// biała lista dostępu CORS
const whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://localhost:3003', 'https://localhost', 'https://backoffice.zerogravity.ptrdigital.xyz']
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.post('/webhooks/gitlab', function(req, res) {
  childProcess.exec('cd /home/virtual/ptrdigital/www/html/backoffice.zerogravity.ptrdigital.xyz/deploy && ./deploy.sh', function(err, stdout, stderr) {
    if (err) {
      console.error(err)
      return res.send(500)
    }
    res.send(200)
  })
})

// logowanie
router.post('/login', (req, res) => {
  axios
    .post('/login', {
      email: req.body.email,
      password: req.body.password,
      captcha: req.body.captcha
    })
    .then(function(response) {
      if (response.status === 200 && response.data && response.data.data && response.data.data.token) {
        req.session.tokenData = response.data.data
        return res.json({ tokenData: response.data.data })
      }
      return res.status(500).json({ code: 500, message: 'General error occured' })
    })
    .catch(function(error) {
      if (error.response) {
        // captcha proxy. Podmieniamy url ze zdalnego na lokalny
        // if (error.response.data && error.response.data.captcha) {
        //   let axiosBaseUrl = axios.defaults.baseURL.replace('/api', '')
        //   let captchaUrl = error.response.data.captcha.replace(axiosBaseUrl, req.protocol + '://' + req.get('host') + '/api')
        //   error.response.data.captcha = captchaUrl
        // }
        return res.status(error.response.status).json(error.response.data)
      }
      return res.status(500).json({ code: 500, message: 'General error occured' })
    })
})

// proxy dla captcha. Pokazujemy captcha z lokalnego serwera, ale pobieramy z API
// router.get('/captcha/mini', (req, res) => {
//   let axiosBaseUrl = axios.defaults.baseURL.replace('/api', '')
//   let imageUrl = axiosBaseUrl + req.url
//   request.get(imageUrl, { encoding: 'binary' }, function(error, response, body) {
//     if (error) {
//       res.status(500).json({ code: 500, message: 'General error occured' })
//     } else {
//       res.writeHead(200, { 'Content-type': 'image/png' })
//       res.end(response.body, 'binary')
//     }
//   })
// })

// wylogowanie
router.post('/logout', (req, res) => {
  delete req.session.tokenData
  req.session.destroy()
  res.status(200).json({ success: true })
})

// odświeżenie tokena
router.put('/refresh', (req, res) => {
  if (req.body && req.body.token) {
    axios
      .put('/refresh', {}, { headers: { Authorization: `Bearer ${req.body.token}` } })
      .then(function(response) {
        if (response.status === 200 && response.data && response.data.data && response.data.data.token) {
          req.session.tokenData = response.data.data
          return res.json({ tokenData: response.data.data })
        }
        return res.status(500).json({ code: 500, message: 'General error occured' })
      })
      .catch(function(error) {
        if (error.response) {
          return res.status(error.response.status).json(error.response.data)
        }
        return res.status(401).json({ code: 401, message: 'Invalid token' })
      })
  } else {
    return res.status(401).json({ code: 401, message: 'Invalid token' })
  }
})

// request  o zresetowanie hasła
router.put('/resetRequest', (req, res) => {
  axios
    .put('/resetRequest', {
      email: req.body.email
    })
    .then(function(response) {
      if (response.status === 200) {
        return res.status(200).json({ success: true })
      }
      return res.status(500).json({ code: 500, message: 'General error occured' })
    })
    .catch(function(error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data)
      }
      return res.status(500).json({ code: 500, message: 'General error occured' })
    })
})

// resert hasła
router.put('/reset', (req, res) => {
  axios
    .put('/reset', {
      password: req.body.password,
      t: req.body.t
    })
    .then(function(response) {
      if (response.status === 200) {
        return res.status(200).json({ success: true })
      }
      return res.status(500).json({ code: 500, message: 'General error occured' })
    })
    .catch(function(error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data)
      }
      return res.status(500).json({ code: 500, message: 'General error occured' })
    })
})

module.exports = {
  path: '/api',
  handler: router
}
