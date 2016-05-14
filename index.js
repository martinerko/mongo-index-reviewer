/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

module.exports = {
  sourceProcessor: require('./lib/sourceProcessor'),
  dbProcessor: require('./lib/dbProcessor'),
  reviewer: require('./lib/reviewer')
};
