
const port = process.env.PORT || 7778;
const db = process.env.DB || 'test';
const host = process.env.HOST || 'localhost';
const domain = `http://${host}:${port}`;
const config = {
  development: {
    MAIL: {
      HOST: "xxxx",
      PORT: 587,
      USER: 'xxx',
      EMAIL:'xxx',
      PASS:'xxx',
      TRANSPORT:'SMTP'
    },
    APP: {
      DB_URL: `mongodb://localhost:27017/${db}`,
      DB: db,
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: port,
      TMP_DIR: 'tmp/',
      UPLOAD_DIR: __dirname + '/app/uploads/'
    },
    AUTH: {
      TWITTER: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/twitter/callback"
      },
      FACEBOOK: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/facebook/callback"
      },
      GOOGLE: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/google/callback"
      }
    },
    MP: {
      KEY: '',
      SECRET: ''
    }
  },
  production: {
     MAIL: {
       USER: '',
       PASS: '',
       TRANSPORT: 'SMTP'
     },

    APP: {
      DB_URL: `mongodb://localhost:27017/${db}`,
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: port,
      TMP_DIR: 'tmp/',
      UPLOAD_DIR: __dirname + '/app/uploads/'
    },
    AUTH: {
      TWITTER: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/twitter/callback"
      },
      FACEBOOK: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/facebook/callback"
      },
      GOOGLE: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/google/callback"
      }
    },
    MP: {
      KEY: '',
      SECRET: ''
    }
  }
};

exports.init = (app) => {
  const mode = app.get('env');
  console.log(`[*] MODE: ${mode}`);
  return config[mode];
}
