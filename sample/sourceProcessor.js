/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sourceProcessor = require("../lib/sourceProcessor");
var path = require("path");

/**
 * Constants
 */

var FILE = './data/library.txt';

sourceProcessor({
  indexFile: process.argv[2] || path.join(__dirname, FILE)
}, function(err, data) {
  if (err) {
    return console.error(err);
  }
  console.log('definitions:');
  console.log(data);
  var totalDef = Object.keys(data).reduce(function(total, ns) {
    return total + data[ns].length;
  }, 0);
  console.log('Total number of indexes %d', totalDef);
});
