var debug = require('debug')('glint-tasks:modules');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var defaults = require('defaults');

var c = require('../config');

module.exports = function modules(o) {
  o = defaults(o, c);

  var src = path.resolve(o.libPath + o.moduleSearch + '/');

  var result = glob.sync(src);
  debug('glob', result);

  return result;

};

if (require.main === module) {
  module.exports();
}