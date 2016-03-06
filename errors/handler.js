'use strict';

const CustomError = require('./Error');

module.exports = function (options) {
  return function (err, req, res, next) {
    if (res.ko && err instanceof Error && !err.toJSON) {
      err = new CustomError(err);
    }

    if (res.ko && err instanceof Error && err.toJSON) {
      let errorOutput;
      let errorJson = err.toJSON();
      let {code, message, data} = errorJson;

      code = code || 500;
      message = message !== 'Error' ? message : undefined;
      errorOutput = res.ko(code, message, data);

      if (code >= 500 && req.app.get('env') !== 'production') {
        errorOutput.stack = err.stack;
      }

      if (code >= 500) {
        console.error(err.stack);
      }

      return res.send(errorOutput);
    }

    next(err);
  };
};