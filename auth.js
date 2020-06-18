const md5 = require('MD5')

exports.login = (db, secret, jwt) => (req, res, next) => {
  const { credentials } = req.body
  if (credentials) {
    credentials.password = md5(credentials.password)
    db.collection('users').findOne(credentials, 
      (err, usr) => {
        if (err || usr === null) {
          return next({error: 'INVALID_CREDENTIALS'})
        }
        usr.token = jwt.sign(usr, secret, { expiresIn: 60 * 5 })
        delete usr.password
        delete usr.username
        res.json(usr)
      }
    )
  } else {
    next({error: 'BAD_REQUEST'})
  }
}

exports.logged  = (req, res, next) => req.isAuthenticated() ? next(): next({error: 'INVALID_CREDENTIALS'})
