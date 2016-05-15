/*!
 * mongo-index-reviewer
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

module.exports = function help() {
  console.log('');
  console.log('  Usage: mongo-index-reviewer connectionString [options]\n');
  console.log('  Options:\n');
  console.log('    --username <username>    specifies a username with which to authenticate to a MongoDB database that uses authentication.');
  console.log('    --password <password>    specifies a password with which to authenticate to a MongoDB database that uses authentication.');
  console.log('    --indexFile <filename>   specifies the file (source of truth) with createIndex statements (required).');
  console.log('');
  console.log('  Sample:\n')
  console.log('    mongo-index-reviewer localhost:27017/test --indexFile ./reviewedIndexes.js')
  console.log('    mongo-index-reviewer ds012345.myserver.com:56789/dbname --username dbuser --password dbpassword --indexFile ./reviewedIndexes.js')
};
