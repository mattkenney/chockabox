'use strict';

const MagicLinkStrategy = require('passport-magic-link').Strategy;
const emailjs = require("emailjs");
const passport = require('passport');

const config = require('../config.json');

const smtp = new emailjs.SMTPClient(config.smtp);

function acceptToken(obj, args, context) {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'magiclink',
      { action : 'acceptToken' },
      (err, user, info, status) => {
        if (err) reject(err);
        if (!user) resolve(false);
        context.login(user, err => err ? reject(err) : resolve(true));
      }
    )({ body: args });
  });
}

function auth(obj, args, context) {
  return !!context.user;
}

function logout(obj, args, context) {
  context.logout();
  return true;
}

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
      data: `<a href="${origin}/login?token=${tokenParam}">log in</a>`
    },
  });

  smtp.send(message, err => err && console.log(err, message));

  return message.to;
}

function sendToken(obj, args, context) {
  return new Promise((resolve, reject) => {
    const req = {
      body: args,
      origin: context.origin
    };
    passport.authenticate(
      'magiclink',
      { action : 'requestToken' },
      (err, user) => {
        if (err) reject(err);
        if (!user) reject(new Error('no user'));
      }
    )(req, null, () => resolve(args.email));
  })
}

function verifyUser(req, args) {
  return args;
}

passport.deserializeUser((user, done) => done(null, user));

passport.serializeUser((user, done) => done(null, user));

passport.use(new MagicLinkStrategy({
  passReqToCallbacks: true,
  secret: config.auth.secret,
  userFields: ['email'],
  tokenField: 'token'
}, sendEmail, verifyUser));

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  return {
    Mutation: {
      acceptToken,
      logout,
      sendToken
    },
    Query: { auth }
  };
};
