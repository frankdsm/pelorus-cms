'use strict';

//var formidable = require('formidable');

module.exports = function(req, res, next) {
/*  var form = new formidable.IncomingForm();
  form.keepExtensions = true;

  function onFileUpload(err, fields, files) {
    console.log(err, fields, files);
    if (err) {
      return res.error(400, 'Something went wrong while uploading file');

    }

    req.body = fields;
    var keys = Object.keys(files);
    if (keys.length > 0) {
      req.file = files[keys[0]];
    }

    next();
  }

  form.parse(req, onFileUpload);
*/
  req.file = req.files.file;
  next();
};
