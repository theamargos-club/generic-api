let serviceSid = null
let client = null

const init = (conf) => {
  client = require('twilio')(conf.TWILLIO.ACCOUNT_SID, conf.TWILLIO.AUTH_TOKEN)
  client.verify.services
    .create({ friendlyName: 'Abakus' })
    .then(service => { serviceSid = service.sid })
}

const createVerification = async (to) =>
  await client.verify.services(serviceSid).verifications.create({ to, channel: 'sms' })

const checkVerificationToken = async (to, code) =>
  await client.verify.services(serviceSid).verificationChecks.create({ code, to })

module.exports = { init, createVerification, checkVerificationToken }
