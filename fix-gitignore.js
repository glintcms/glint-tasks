var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var defaults = require('defaults');
var clone = require('clone');
var includes = require('lodash.includes');
var dedupe = require('dedupe');

var log = require('./utils').log;
var Modules = require('./modules');
var c = require('./config');

var argv = process.argv.slice(2);

var gitignoreTemplate = fs.readFileSync(__dirname + '/templates/.gitignore', 'utf-8');

module.exports = function fix(modules, o, write) {
  o = defaults(o, c);

  modules = modules || Modules();

  console.log(chalk.bold.inverse.blue('glint fix-gitignore:'));
  console.log();

  log('found modules:', modules);

  fixGitignores(modules, o, write);

};

function fixGitignores(modules, o, write) {

  var packageErrors = [];

  modules.forEach(function(module) {
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
  var write = includes(argv, 'write');
  module.exports(null, null, write);
}
