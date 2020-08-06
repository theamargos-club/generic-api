const md5 = require('MD5')
const {res_error} = require('./errors');

exports.login = (db, secret, jwt) => (req, res) => {
  const { credentials } = req.body
  if (credentials) {
    credentials.password = md5(credentials.password)
    db.collection('users').findOne(credentials, 
      (err, usr) => {
        if (err || usr === null) {
          return res_error(res, 'INVALID_CREDENTIALS')
        }
        usr.token = jwt.sign(usr, secret, { expiresIn: 60 * 5 })
        delete usr.password
        delete usr.username
        return res.json(usr)
      }
    )
  } else {
    return res_error(res, 'SERVER_ERROR')
  }
}

exports.logged  = (req, res, next) => req.isAuthenticated() ? next(): res_error(res, 'INVALID_CREDENTIALS')
