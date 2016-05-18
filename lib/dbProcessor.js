/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('mongo-index-reviewer:dbProcessor');
var dbIndexExporter = require('mongo-index-exporter');
var reject = require('lodash.reject');

/**
 * Constants
 */

var _ID_KEY = {
  "_id": 1
};

/**
 * Returns data under key property, typically index definition.
 *
 * @param  {Object} indexDefObj
 * @return {Object}
 * @api private
 */

function getKeysDef(indexDefObj) {
  return indexDefObj.key;
}

/**
 * Function which loads informations about indexes defined in specified database.
 *
 * @param  {Object}   args     database connection parameters. Args must be compliant with mongo-index-exporter
 * @param  {Function} callback function to be executed when after processing.
 * @api public
 */

function dbProcessor(args, callback) {
  debug('loading db indexes');

  dbIndexExporter(args, function(err, data) {
    if (err) {
      callback(err);
    } else {
      var indexes = Object.keys(data).reduce(function(result, col) {
        var keys = data[col].map(getKeysDef);
        // do not report _id key
        result[col] = reject(keys, _ID_KEY);
        return result;
      }, {});
      callback(null, indexes);
    }
  });
}

module.exports = dbProcessor;
