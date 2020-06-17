const http = require('http')
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const session = require('express-session')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const settings = require('./config')
const auth = require('./auth');
const errors = require('./errors');
const { gLst, gGet, gPut, gDel, gUpd } = require('./api')
const mail = require('./mail')

const app = express();
const config = settings.init(app);
const secret = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$";

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({ secret: secret, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/', expressJwt({secret: secret}));
app.use(require('express-validator')());


MongoClient.connect(config.APP.DB_URL, (
  (err, db) => {
    if(err){
      console.log('Unable to connect to mongodb', err)
      return;
    }

    //mail.init(config);

    app.post('/signup', auth.signup(db, mail));
    app.get ('/confirm/:token', auth.confirm(db));
    app.post('/login', auth.login(db, secret, jwt));

    // generic api
    app.post('/api/:entity/lst', gLst(db));
    app.get ('/api/:entity/get', gGet(db));
    app.get ('/api/:entity/del', gDel(db));
    app.post('/api/:entity/put', gPut(db));
    app.post('/api/:entity/upd', gUpd(db));
    app.get('/mp/get', mpGet(mp));
    app.get('/mp/qr', mpQr(mp));

    app.all('*', function(req, res){
      res.status(404).json(errors.type.NOT_FOUND);
    });

    http.createServer(app).listen(config.APP.PORT, function() {
      console.log(config.APP.DB_URL);
      console.log("\n[*] Server Listening on port %d", config.APP.PORT);
    });
  }
));

// Global error handler
app.use((err, req, res, next) => {
  if (!('error' in err)) {
    console.log(err.stack); // Log stack error in console
    res.status(500).send(errors.type.SERVER_ERROR);
    return;
  }

  if (!(err.error in errors.type)){
    res.status(500).send(errors.type.SERVER_ERROR);
    return;
  }

  let e = errors.type[err.error];
  delete err.error;
  e.error = Object.assign({}, e.error, err);
  res.status(e.error.code).json(e);
});

