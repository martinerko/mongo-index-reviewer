/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require("path");
var lib = require("..");
var sourceProcessor = lib.sourceProcessor;
var dbProcessor = lib.dbProcessor;
var reviewer = lib.reviewer;

/**
 * Constants
 */

var FILE = './data/library.txt';
var connectionString = "localhost:27017/library";

dbProcessor({
  connectionString: connectionString,
  //username: 'john'
  //password: 'T0pS3ecr3tP@ssw0rd',
  //authenticationDatabase: 'admin'
}, function(err, dbCollectionsIndexes) {
  if (err) {
    console.log(err);
  } else {

    sourceProcessor({
      indexFile: process.argv[2] || path.join(__dirname, FILE)
    }, function(err, sourceCollectionsIndexes) {
      if (err) {
        return console.error(err);
      }

      reviewer(sourceCollectionsIndexes, dbCollectionsIndexes, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    });
  }
});
