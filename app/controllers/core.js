'use strict';

/**
 * @api {get} /env Return current NODE_ENV
 * @apiGroup Core
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         env: 'development'
 *     }
 */
exports.env = function(req, res, next) {
    res.status(200).json({env: process.env.NODE_ENV});
};
