const nodemailer = require('nodemailer');
const md5 = require('MD5');

let smtpTransport  = null;
let urlConfirmMail = null;
let mailOptions    = {
  from: '', to: '', subject: '', html: '', text: ''
};

const init = (conf) => {
  urlConfirmMail = conf.APP.CONFIRM_ACCOUNT_LINK;
  smtpTransport = nodemailer.createTransport({
    host: conf.MAIL.HOST,
    port: conf.MAIL.PORT,
    auth: { 
      user: conf.MAIL.USER, 
      pass: conf.MAIL.PASS,
    },
    debug: true,
    logger: true,
  });
  mailOptions.from = conf.MAIL.EMAIL;
};

const sendMail = (to, subject, body, isHtmlBody) => {
  mailOptions.to = to;
  mailOptions.subject = subject;
  if (isHtmlBody) {
    mailOptions.html = body;
  } else {
    mailOptions.text = body;
  }
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + response.message);
    }  
  });
};
const sendConfirmateMail = (to) => {
  var subject = 'Por favor, confirma tu email. Abakus',
      token   = md5(Date() + to),
      html    = getLinkConfirmate(to, token);
  sendMail(to, subject, html, true);
  return token;
};

const getLinkConfirmate = (to, token)  => (
  `<a href="${urlConfirmMail}/${token}"> Click aqui para confirmar</a>`
)

module.exports = { init, sendMail, sendConfirmateMail }
