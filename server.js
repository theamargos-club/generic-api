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
const { res_error } = require('./errors')
const { gLst, gGet, gPut, gDel, gUpd } = require('./api')

const app = express()
const config = settings.init(app)
mail.init(config)
const secret = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$"

app.use(cors())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(session({ secret: secret, resave: true, saveUninitialized: true}))
app.use('/api/', expressJwt({secret: secret, algorithms: ['HS256']}))


MongoClient.connect(config.APP.DB_URL, {useUnifiedTopology: true}, (
  (err, conn) => {
    if(err) return console.log('Unable to connect to mongodb', err)

    const db = conn.db(config.APP.DB)

    // auth entrypoints
    app.post('/signup', auth.signup(db, mail))
    app.get ('/confirm/:token', auth.confirm(db))
    app.post('/login', auth.login(db, secret, jwt))

    // generic api
    app.post('/api/:entity/lst', gLst(db))
    app.get ('/api/:entity/get', gGet(db))
    app.get ('/api/:entity/del', gDel(db))
    app.post('/api/:entity/put', gPut(db))
    app.post('/api/:entity/upd', gUpd(db))

    app.all('*', (req, res) => res_error(res, 'NOT_FOUND'))

    app.listen(config.APP.PORT, () => {
      console.log(`[*] Database URL ${config.APP.DB_URL}`)
      console.log(`[*] Server Listening on port ${config.APP.PORT}`)
    });
  }
));

