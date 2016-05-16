/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var dbProcessor = require("..").dbProcessor;
var connectionString = "localhost:27017/library";

dbProcessor({
  connectionString: connectionString,
  //username: 'john'
  //password: 'T0pS3ecr3tP@ssw0rd',
  //authenticationDatabase: 'admin'
}, function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
