'use strict';

const MagicLinkStrategy = require('passport-magic-link').Strategy;
const emailjs = require("emailjs");
const passport = require('passport');

const config = require('../config.json');

const smtp = new emailjs.SMTPClient(config.smtp);

module.exports = app => {
  function sendEmail(req, user, token) {
    const origin = config.origin || req.origin;
    const tokenParam = encodeURIComponent(token);

    const message = new emailjs.Message({
      from: config.auth.email.from,
      to: user.email,
      subject: config.auth.email.subject,
      text: `${origin}?token=${tokenParam}`,
      attachment: {
        alternative: true,
        type: 'text/html',
        data: `<a href="${origin}?token=${tokenParam}">log in</a>`
      },
    });

    return new Promise((resolve, reject) => {
      smtp.send(message, (err, message) => {
        if (err) {
          console.log(err, message);
          return reject(err);
        }
        resolve(message.to);
      });
    });
  }

  function sendToken(obj, args, context) {
    const req = {
      body: args,
      origin: context.origin
    };
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'magiclink',
        { action : 'requestToken' },
        (err, user) => { if (err || !user) reject(err); }
      )(req, null, () => resolve(args.email));
    })
  };

  function verifyUser(req, args) {
    return args;
  }

  passport.use(new MagicLinkStrategy({
    passReqToCallbacks: true,
    secret: config.auth.secret,
    userFields: ['email'],
    tokenField: 'token'
  }, sendEmail, verifyUser));

  return { Mutation: { sendToken } };
};
