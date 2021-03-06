/* global WIKI */

// ------------------------------------
// Okta Account
// ------------------------------------

const OktaStrategy = require('passport-okta-oauth').Strategy
const _ = require('lodash')

module.exports = {
  init (passport, conf) {
    passport.use('okta',
      new OktaStrategy({
        audience: conf.audience,
        clientID: conf.clientId,
        clientSecret: conf.clientSecret,
        idp: conf.idp,
        callbackURL: conf.callbackURL,
        response_type: 'code'
      }, async (accessToken, refreshToken, profile, cb) => {
        try {
          const user = await WIKI.models.users.processProfile({
            profile: {
              ...profile,
              picture: _.get(profile, '_json.profile', '')
            },
            providerKey: 'okta'
          })
          cb(null, user)
        } catch (err) {
          cb(err, null)
        }
      })
    )
  }
}
