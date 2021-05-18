const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const settings = require('./config')
const auth = require('./auth')
const mail = require('./mail')
const phone = require('./phone')
const { resError } = require('./errors')
const { gLst, gGet, gPut, gDel, gUpd, gUpdPassword, gCreateWallet } = require('./api')

const app = express()
const config = settings.init(app)
mail.init(config)
phone.init(config)
const secret = process.env.SEED

app.use(cors())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(session({ secret: secret, resave: true, saveUninitialized: true }))
app.use('/api/', expressJwt({ secret: secret, algorithms: ['HS256'] }))

MongoClient.connect(config.APP.DB_URL, { useUnifiedTopology: true },
  (err, conn) => {
    if (err) return console.log('Unable to connect to mongodb', err)

    const db = conn.db(config.APP.DB)
    // auth entrypoints
    app.post('/signup', auth.signup(db, mail))
    app.get('/confirm/:token', auth.confirm(db))
    app.post('/login', auth.login(db, secret, jwt))
    app.post('/updphone', auth.updatePhone(db, phone))
    app.post('/confirmphone', auth.confirmPhone(db, phone))

    // generic api
    app.post('/api/:entity/lst', gLst(db))
    app.get('/api/:entity/get', gGet(db))
    app.get('/api/:entity/del', gDel(db))
    app.post('/api/:entity/put', gPut(db))
    app.post('/api/:entity/upd', gUpd(db))
    app.post('/api/:entity/updPassword', gUpdPassword(db))
    app.post('/api/:entity/createWallet', gCreateWallet(db))
    app.all('*', (req, res) => resError(res, 'NOT_FOUND'))

    app.listen(config.APP.PORT, () => {
      console.log(`[*] Database URL ${config.APP.DB_URL}`)
      console.log(`[*] Server Listening on port ${config.APP.PORT}`)
    })
  }
)
