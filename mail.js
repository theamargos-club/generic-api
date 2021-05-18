const nodemailer = require('nodemailer')
const md5 = require('MD5')

let smtpTransport = null
let urlConfirmMail = null
const mailOptions = {
  from: '', to: '', subject: '', html: '', text: ''
}

const init = (config) => {
  urlConfirmMail = config.APP.CONFIRM_ACCOUNT_LINK
  smtpTransport = nodemailer.createTransport({
    host: config.MAIL.HOST,
    port: config.MAIL.PORT,
    auth: {
      user: config.MAIL.USER,
      pass: config.MAIL.PASS
    },
    debug: true,
    logger: true
  })
  mailOptions.from = config.MAIL.EMAIL
}

const sendMail = (to, subject, body, isHtmlBody) => {
  mailOptions.to = to
  mailOptions.subject = subject
  if (isHtmlBody) {
    mailOptions.html = body
  } else {
    mailOptions.text = body
  }
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) console.log(error)
    else console.log('Message sent: ' + response.message)
  })
}
const sendConfirmateMail = (to) => {
  const subject = 'Por favor, confirma tu email. Abakus'
  const token = md5(Date() + to)
  const html = getLinkConfirmate(to, token)
  sendMail(to, subject, html, true)
  return token
}

const getLinkConfirmate = (to, token) => (
  `<a href="${urlConfirmMail}/${token}"> Click aqui para confirmar</a>`
)

module.exports = { init, sendMail, sendConfirmateMail }
