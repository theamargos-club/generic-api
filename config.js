const port = process.env.PORT || 7778;
const db = process.env.DB || "test";
const host = process.env.HOST || "localhost";
const domain = `http://${host}:${port}`;
const config = {
  development: {
    MAIL: {
      HOST: "smtp.dondominio.com",
      PORT: 465,
      USER: "marcelo@abakus.life",
      EMAIL: "marcelo@abakus.life",
      PASS: "Marcelo2020@",
      TRANSPORT: "SMTP"
    },
    APP: {
      DB_URL: `mongodb://localhost:27017/${db}`,
      DB: db,
      //CONFIRM_ACCOUNT_LINK: domain + "/confirm",
      CONFIRM_ACCOUNT_LINK: "http://api.abakus.life:8080/confirm",
      PORT: port,
      TMP_DIR: "tmp/",
      UPLOAD_DIR: __dirname + "/app/uploads/"
    },
    AUTH: {
      TWITTER: {
        KEY: "",
        SECRET: "",
        CALLBACK: domain + "/auth/twitter/callback"
      },
      FACEBOOK: {
        KEY: "",
        SECRET: "",
        CALLBACK: domain + "/auth/facebook/callback"
      },
      GOOGLE: {
        KEY: "",
        SECRET: "",
        CALLBACK: domain + "/auth/google/callback"
      }
    },
    MP: {
      KEY: "",
      SECRET: ""
    },
    TWILLIO: {
      AUTH_TOKEN: "9e3c22e10e5bffdad92299fbbf8262cd",
      ACCOUNT_SID: "ACf7ce7e46a080d7d4b8062ffca1d12d25",
      FRIENDLY_NAME: "Abakus"
    }
  },
  production: {
    MAIL: {
      HOST: "smtp.dondominio.com",
      PORT: 465,
      USER: "marcelo@abakus.life",
      EMAIL: "marcelo@abakus.life",
      PASS: "Marcelo2020@",
      TRANSPORT: "SMTP"
    },
    APP: {
      DB_URL: `mongodb://localhost:27017/${db}`,
      CONFIRM_ACCOUNT_LINK: domain + "/confirm/email",
      PORT: port,
      TMP_DIR: "tmp/",
      UPLOAD_DIR: __dirname + "/app/uploads/"
    },
    AUTH: {
      TWITTER: {
        KEY: "",
        SECRET: "",
        CALLBACK: domain + "/auth/twitter/callback"
      },
      FACEBOOK: {
        KEY: "",
        SECRET: "",
        CALLBACK: domain + "/auth/facebook/callback"
      },
      GOOGLE: {
        KEY: "",
        SECRET: "",
        CALLBACK: domain + "/auth/google/callback"
      }
    },
    MP: {
      KEY: "",
      SECRET: ""
    },
    TWILLIO: {
      AUTH_TOKEN: "9e3c22e10e5bffdad92299fbbf8262cd",
      ACCOUNT_SID: "ACf7ce7e46a080d7d4b8062ffca1d12d25",
      FRIENDLY_NAME: "Abakus"
    }
  }
};

exports.init = (app) => {
  const mode = app.get('env');
  console.log(`[*] MODE: ${mode}`);
  return config[mode];
};
