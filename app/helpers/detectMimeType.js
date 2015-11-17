'use strict';

var imageService = require('app/controllers/services/imageService');

module.exports = function(req, res, next) {
  var file = req.file;

  if (!!req.body.mimeType) {
    req.mimeType = req.body.mimeType;
    return next();
  }

  imageService.detectMimeType(file.path, function onDetectType(err, detectedMimeType) {
    if (err) {
      return res.error(400, 'Could not detect mimeType');
    }

    req.mimeType = detectedMimeType;
    return next();

  });
};
