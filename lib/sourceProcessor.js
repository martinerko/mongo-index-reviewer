/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('mongo-index-reviewer:sourceProcessor');
var readFile = require('fs-readfile-promise');

/**
 * Constants
 */

var REGEXP_REPLACE_CRLF = /\r\n/g;
var REGEXP_REPLACE_LINES_AFTER_COMMAS = /\,\s*\n\s+/g;
var REGEXP_REPLACE_LINES_BEFORE_INDEX = /\(\s*\{\s*\n\s+/g;
var REGEXP_REPLACE_LINES_AFTER_INDEX = /1\n\s*\}/g;
var REGEXP_REPLACE_EVERYTHING_AFTER_INDEX = /\}[^\)]+\)/g;
var REGEXP_REPLACE_COLON_SPACES = /\s*\:\s*/g;
var REGEXP_REPLACE_ADD_QUOTES = /(\{|\,)(\w+)/g;
var REGEXP_MATCH_INDEX_DOT_DEFINITION = /^\s*db\.([^\.]+(?:\.[^\.]+)*)\.(?:(?:create|ensure)Index)\((.+)\)/;
var REGEXP_MATCH_INDEX_ARR_DEFINITION = /^\s*db(?:\[['"])([^('|")]+)(?:['"]\])\.(?:(?:create|ensure)Index)\((.+)\)/;

/**
 * Parses file passed as a reference and collects informations about
 * defined indexes.
 *
 * @param  {Object}   args      parameters
 * @param  {Function} callback  function to be executed after processing
 * @api public
 */

function sourceProcessor(args, callback) {
  var file = args.indexFile;
  debug('loading indexes from ' + file);

  readFile(file)
    .then(String)
    .then(cleanup)
    .then(collectAllIndexes)
    .then(callback.bind(null, null))
    .catch(callback);
}

/**
 * Clean-up received text from unnecessary characters and prepare it for
 * additional parsing.
 *
 * @param  {String} text
 * @return {String}
 * @api private
 */

function cleanup(text) {
  return text.replace(REGEXP_REPLACE_CRLF, '\n')
    //remove new lines after commas
    .replace(REGEXP_REPLACE_LINES_AFTER_COMMAS, ',')
    //replace new lines from the begining
    .replace(REGEXP_REPLACE_LINES_BEFORE_INDEX, '\({')
    //replace new lines after indexes keys
    .replace(REGEXP_REPLACE_LINES_AFTER_INDEX, '1}')
    //replace everything that might occurs after whole index definition
    .replace(REGEXP_REPLACE_EVERYTHING_AFTER_INDEX, '}\)')
    //replace spaces around colons
    .replace(REGEXP_REPLACE_COLON_SPACES, ':')
    //wrap all properties in quotes
    .replace(REGEXP_REPLACE_ADD_QUOTES, '$1"$2"');
}

/**
 * Reducer function which grabs details about index definition.
 *
 * @param  {Object} definitions
 * @param  {String} line
 * @return {Object}
 * @api private
 */

function reducerGrabIndexDefinition(definitions, line) {
  var def = line.match(REGEXP_MATCH_INDEX_DOT_DEFINITION);
  if (!(def && def.length == 3)) {
    def = line.match(REGEXP_MATCH_INDEX_ARR_DEFINITION);
    if (!(def && def.length == 3)) {
      return definitions;
    }
  }
  definitions.push(def.slice(1));
  return definitions;
}

/**
 * Reducer function which groups indexes by collection name
 *
 * @param  {Object} map
 * @param  {Array}  def
 * @return {Object}
 * @api private
 */

function reducerGroupIndexDefinitionsByCollection(map, def) {
  var ns = def[0];
  if (!map.hasOwnProperty(ns)) {
    map[ns] = [];
  }
  try {
    map[ns].push(JSON.parse(def[1]));
  } catch (e) {
    debug('ERROR: can\'t parse index defintion ' + def.join(" - "));
  }
  return map;
}

/**
 * Collects information about collections and their indexes.
 *
 * @param  {String} text  text with index definitions
 * @return {Object}
 * @api private
 */

function collectAllIndexes(text) {
  debug('collecting source indexes');
  return text.split('\n')
    .reduce(reducerGrabIndexDefinition, [])
    .reduce(reducerGroupIndexDefinitionsByCollection, {});
}

module.exports = sourceProcessor;
