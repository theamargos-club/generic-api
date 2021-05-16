const md5 = require('MD5')
const { res_error } = require('./errors')

exports.login = (db, secret, jwt) => (req, res) => {
  const { credentials } = req.body
  if (!credentials) {
    return res_error(res, 'SERVER_ERROR')
  }
  credentials.password = md5(credentials.password)
  db.collection('users').findOne(credentials,
    (err, usr) => {
      if (err || usr === null || !usr.approved) {
        return res_error(res, 'INVALID_CREDENTIALS')
      }
      usr.token = jwt.sign(usr, secret, { expiresIn: 60 * 5 })
      delete usr.password
      delete usr.username
      return res.json(usr)
    }
  )
}

exports.signup = (db, mail) => async (req, res) => {
  const { signup } = req.body
  if (!signup) {
    return res_error(res, 'SERVER_ERROR')
  }

  const { username, password } = signup

  const usr = await db.collection('users').findOne({ username })
  if (usr) {
    return res_error(res, 'UNPROCESSABLE_ENTITY')
  }

  token = mail.sendConfirmateMail(username);
  const data = {
    approved: false,
    password: md5(password),
    token,
    username,
  }

  const result = await db.collection('users').insertOne(data)
  res.json({ res: 'OP_OK', data })
}

exports.logged = (req, res, next) => req.isAuthenticated() ? next() : res_error(res, 'INVALID_CREDENTIALS')

exports.confirm = (db) => async (req, res) => {
  const { token } = req.params
  if (!token) {
    return res_error(res, 'SERVER_ERROR')
  }

  const data = await db.collection('users').updateOne(
    {
      token: req.params.token
    },
    {
      $set: {
        approved: true,
      }
    }
  )

  if (data.result.ok < 1) {
    res_error(res, 'INVALID_CREDENTIALS')
    return
  }
  res.json({ res: 'OP_OK', approved: true })
}

exports.updatePhone = (db, phone) => async (req, res) => {

  const { username, number } = req.body
  if (!username || !number) {
    return res_error(res, 'BAD_REQUEST', 'missing fields: username or number ')
  }

  const usr = await db.collection('users').findOne({ username })

  if (!usr) {
    return res_error(res, 'NOT_FOUND', 'user not found')
  }

  // SENDING CONFIRMATION CODE
  let verificationData
  try {
    verificationData = await phone.createVerification(number);
  } catch {
    return res_error(res, 'UNPROCESSABLE_ENTITY', 'verify failure')
  }

  // UPDATING USER PHONE NUMBER
  const data = await db.collection('users').updateOne(
    {
      username
    },
    {
      $set: {
        phone: {
          number,
          verified: false,
        }
      }
    }
  )
  if (data.result.ok < 1) {
    return res_error(res, 'UNPROCESSABLE_ENTITY')
  }
  res.json({ res: 'OP_OK', verified: verificationData.status })
}

exports.confirmPhone = (db, phone) => async (req, res) => {

  const { username, number, code } = req.body
  if (!username || !number || !code)
    return res_error(res, 'BAD_REQUEST', 'missing fields: username or number or code ')

  const usr = await db.collection('users').findOne({ username })
  if (!usr)
    return res_error(res, 'NOT_FOUND', 'user not found')

  let verificationData
  try {
    verificationData = await phone.checkVerificationToken(number, code);
  } catch {
    return res_error(res, 'UNPROCESSABLE_ENTITY', 'verify failure')
  }

  if (!(verificationData.status && verificationData.valid))
    return res_error(res, 'UNPROCESSABLE_ENTITY', 'incorrect code')

  const data = await db.collection('users').updateOne(
    {
      username
    },
    {
      $set: {
        phone: {
          number,
          verified: true
        }
      }
    }
  )

  if (data.result.ok < 1)
    return res_error(res, 'UNPROCESSABLE_ENTITY')

  res.json({ res: 'OP_OK', verified: verificationData.status })
}