const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const port = process.env.PORT || 7777
const host = process.env.HOST || 'localhost'
const domain = `http://${host}:${port}`

const config = {
  MAIL: {
    HOST: process.env.MAIL_HOST,
    PORT: process.env.MAIL_PORT,
    USER: process.env.MAIL_ADDRESS,
    EMAIL: process.env.MAIL_ADDRESS,
    PASS: process.env.MAIL_PASSWORD,
    TRANSPORT: 'SMTP'
  },
  APP: {
    DB_URL: `mongodb://localhost:27017/${process.env.DB_NAME}`,
    DB: process.env.DB_NAME,
    CONFIRM_ACCOUNT_LINK: `${domain}/confirm`,
    PORT: port,
    TMP_DIR: 'tmp/',
    UPLOAD_DIR: path.join(__dirname, '/app/uploads/')
  },
  TWILLIO: {
    AUTH_TOKEN: process.env.TWILLIO_TOKEN,
    ACCOUNT_SID: process.env.TWILLIO_SID,
    FRIENDLY_NAME: process.env.TWILLIO_FRIENDLY_NAME
  }
}

exports.init = (app) => {
  const mode = app.get('env')
  console.log(`[*] MODE: ${mode}`)
  console.log(`[*] DOMAIN: ${domain}`)
  return config
}
