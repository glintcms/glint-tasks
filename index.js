var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var log = require('./lib//utils').log;
var Modules = require('./lib/modules');
var Readmes = require('./lib/readmes');

module.exports = function glintModules(modules) {
  modules = modules || Modules();

  console.log(chalk.bold.inverse.blue('glint report:'));
  console.log();

  var moduleNamesArray = moduleNames(modules);

  log('modules (copy&paste)', modules.join(' '));

  log('modules array', modules);


  log('module names (copy&paste):', moduleNamesArray.join(' '));

  log('module names array:', moduleNamesArray);



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