/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var differenceWith = require('lodash.differencewith');
var intersection = require('lodash.intersection');

/**
 * Compares indexes collected from source file with those from db and returns
 * map of those which should be removed.
 *
 * @param  {Object} sourceCollectionDef
 * @param  {Object} dbCollectionsDef
 * @return {Object}
 * @api private
 */

function getOutstandingIndexes(sourceCollectionDef, dbCollectionsDef) {
  // compare definitions in source file with definitions that exists in database
  // returns outstanding database indexes that should be removed
  return differenceWith(dbCollectionsDef, sourceCollectionDef, stringifyComparator);
}

/**
 * Compare two objects after stringifying them
 * @param  {Object} a
 * @param  {Object} b
 * @return {Boolean}
 */
function stringifyComparator(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Review indexes between source file and database. Returns collection-index map
 * with indexes that should be removed from database.
 *
 * @param  {Object}   sourceIndexesMap collection-index map typically from source processor
 * @param  {Object}   dbIndexesMap     collection-index map typically from db processor
 * @param  {Function} callback         function to be executed once comparision is finished
 * @return {Object}
 */

function reviewer(sourceIndexesMap, dbIndexesMap, callback) {
  var sourceCollections = Object.keys(sourceIndexesMap).sort();
  var dbCollections = Object.keys(dbIndexesMap).sort();
  var commonCollections = intersection(sourceCollections, dbCollections).sort();

  var outstandingIndexesInDb = commonCollections.reduce(function(oustandingIndexesMap, collectionName) {
    var outstanding = getOutstandingIndexes(sourceIndexesMap[collectionName], dbIndexesMap[collectionName]);
    outstanding.length && (oustandingIndexesMap[collectionName] = outstanding);
    return oustandingIndexesMap;
  }, {});

  callback(null, outstandingIndexesInDb);
}

module.exports = reviewer;
