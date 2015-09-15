var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var defaults = require('defaults');
var clone = require('clone');
var includes = require('lodash.includes');
var dedupe = require('dedupe');

var log = require('./lib/utils').log;

var c = require('./config');

var gitignoreTemplate = fs.readFileSync(__dirname + '/templates/.gitignore', 'utf-8');

module.exports = function fix(o) {
  o = defaults(o, c);
  o.modules = o.modules || o._;

  console.log(chalk.bold.inverse.blue('glint fix-gitignore:'));
  console.log();

  var packageErrors = [];

  o.modules.forEach(function(module) {
    var p = module + '/.gitignore';
    try {
      var gitignore = fs.readFileSync(p, 'uft-8');
    } catch (err) {
      log('ERRORNOGITIGNORE', module);
      fs.writeFileSync(p, gitignoreTemplate);
      packageErrors.push(module);
    }
  });

  return packageErrors;
}

if (require.main === module) {
  var args = require('subarg')(process.argv.slice(2));
  module.exports(args);
}
