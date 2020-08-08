'use strict';

const config = require('../config.json');

// support multipart/form-data POST
const multer  = require('multer');
const any = multer({ storage: multer.diskStorage({}), ...config.multer}).any();

function upload(req, res, next) {
  any(req, res, () => {
    req.files.forEach(file => {
      req.body[file.fieldname] = [ Promise.resolve({
        createReadStream: function () {
          const result = fs.createReadStream(file.path);
          fs.unlink(file.path, err => err && console.log(err));
          return result;
        },
        encoding: file.encoding,
        filename: file.originalname,
        mimetype: file.mimetype
      })];
    });
console.log('upload', req.files);
    next();
  });
}

function uploadDeck(parent, args, context) {
console.log('uploadDeck', args);
  if (!context.user) throw new AuthenticationError();
  return args.file[0];
}

module.exports = app => {
  app.post('/upload', upload);

  return {
    Mutation: { uploadDeck }
  };
};
