'use strict';
var _ = require('lodash');

module.exports = function(req, res, next) {

  if (req.file) {
    return next();
  }

  // check whether there actually is a file present
  if (!req.file || !req.files || Object.getOwnPropertyNames(req.files).length === 0) {
    return res.error(400, 'No file was given to be uploaded');
  }

  // We don't know the key with which the asset is uploaded.
  // Only one file upload is supported. We only upload one file.
  var file = null;
  _(req.files).each(function(uploadedFile) {
    file = uploadedFile;
  });

  req.file = file;

  return next();
};
