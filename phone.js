let authToken = null;
let accountSid = null;
let service_sid = null;
let client = null

const init = (conf) => {
  authToken = conf.TWILLIO.AUTH_TOKEN;
  accountSid = conf.TWILLIO.ACCOUNT_SID;
  client = require('twilio')(conf.TWILLIO.ACCOUNT_SID, conf.TWILLIO.AUTH_TOKEN);
  client.verify.services.create({ friendlyName: 'Abakus' }).then(service => { service_sid = service.sid });
};

const createVerification = async (to) => {
  try {
    return await client.verify.services(service_sid)
      .verifications
      .create({ to, channel: 'sms' })
  } catch (e) {
    throw e
  }
}

const checkVerificationToken = async (to, code) => {
  try {
    return await client.verify.services(service_sid).verificationChecks.create({ code, to })
  } catch (e) {
    throw e
  }
}

module.exports = { init, createVerification, checkVerificationToken }