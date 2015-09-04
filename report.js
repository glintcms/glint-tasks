var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var log = require('./utils').log;
var Modules = require('./modules');
var Readmes = require('./readmes');

var argv = process.argv.slice(2);

module.exports = function glintModules(modules) {
  modules = modules || Modules();

  console.log(chalk.bold.inverse.blue('glint report:'));
  console.log();

  log('found modules:', modules);

  log('module names:', moduleNames(modules));

  log('modules with missing package.json', missingPackage(modules));

  log('found readme files', Readmes());

  log('modules with missing readme file', missingReadme(modules));

};

function missingPackage(modules) {
  var missing = modules.filter(function(module) {
    var exists = fs.existsSync(module + '/package.json');
    return !exists;
  });
  return missing;
}

function missingReadme(modules) {
  var missing = modules.filter(function(module) {
    var exists = fs.existsSync(module + '/README.md');
    return !exists;
  });
  return missing;
}

function moduleNames(modules) {
  return modules.map(function(module) {
    return module.split(path.sep).pop();
  });
}

if (require.main === module) {
  module.exports();
}