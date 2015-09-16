var debug = require('debug')('glint-tasks:readmes');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

module.exports = function modules(search) {
  search = search || 'glint-*/*.md';
  var src = path.resolve('../' + search);
  var result = glob.sync(src);
  debug('readmes', result);

  return result;

};

if (require.main === module) {
  module.exports();
}