const md5 = require('MD5');

exports.signup = function (db, mail) {
  return function (req, res, next) {
    let usr, users, token;
    console.log(req.body.signup);

    // existe el usuario?
    db.get('users').findOne({ username: req.body.signup.username})
      .success(function(usr) {
        if (usr) {
          next({error: 'UNPROCESSABLE_ENTITY', message: 'User exist in the system'})
          return;
        } else {
          // habria que ver si se puede guardar el token que luego
          // se usa para auth. Asi cada vez que inica el dispositivo y si se
          // reinicio el server ... no pierde el login.
          token = mail.sendConfirmateMail(req.body.username);
          req.body.signup.approved = true;
          req.body.signup.password = md5(req.body.signup.password);
          req.body.signup.token    = token;

          db.get('users').insert(req.body.signup, function(err, doc) {
            res.json({ res: 'OP_OK', data: req.body.signup });
          });
        }
      });
  };
};

exports.confirm = function (db) {
  return function (req, res, next) {
    req.checkParams('token', 'required').notEmpty();
    req.checkParams('token', 'invalid').len(15, 200);
    const errors = req.validationErrors();
    if (errors) {
        res.json({
        err: 'Invalid parameters',
        errors: errors
      }, 500);
      return;
    }
    const users = db.get('users');
      users.update({ token: req.params.token }, {
      $set: {
        approved: true,
      }
    }, function(err, data) {
      if (err || (data === 0)) {
        next({error: 'INVALID_CREDENTIALS', message: "Token don't exist"})
        return;
      }
        res.json({ res: 'OP_OK' });
    });
  };
};

exports.login = function (db, secret, jwt) {
  return function (req, res, next) {
    let usr;
    if (req.headers.authorization) {
      usr = jwt.decode(req.headers.authorization.replace('bearer ', ''));
    }
    if ('credentials' in req.body) {
      req.body.credentials.password = md5(req.body.credentials.password);
      console.log(JSON.stringify(req.body.credentials));
      db.get('users').findOne(req.body.credentials)
        .then( function (usr) {
          if (usr!== null) {
            const token = jwt.sign(usr, secret, { expiresIn: 60 * 5 });
            usr.token = token;
            usr.id = usr._id;
            delete usr.password;
            delete usr.username;
            res.json(usr);
          } else {
            next({error: 'INVALID_CREDENTIALS'});
          }
        },
        function (err) {
          next({error: 'INVALID_CREDENTIALS'});
        });
    } else {
      next({error: 'BAD_REQUEST'});
    }
  };
};

exports.logged  = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  next({error: 'INVALID_CREDENTIALS'});
};
