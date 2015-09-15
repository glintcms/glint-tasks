var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var defaults = require('defaults');
var clone = require('clone');
var includes = require('lodash.includes');
var dedupe = require('dedupe');
var dot = require('dot');
dot.templateSettings.strip = false;

var log = require('./lib/utils').log;
var c = require('./config');

var readmeText = fs.readFileSync(__dirname + '/templates/README.dot', 'utf-8');
var readmeTemplate = dot.template(readmeText);

module.exports = function fix(o) {
  o = defaults(o, c);
  o.modules = o.modules || o._;

  console.log(chalk.bold.inverse.blue('glint fix-readme:'));
  console.log();

  fixReadmes(o);

};

function fixReadmes(o) {

  var packageErrors = [];

  o.modules.forEach(function(module) {
    var p = module + '/README.md';
    console.log('p', p);
    try {
      var readmeFile = fs.readFileSync(p, 'utf-8');
    } catch (e) {
      console.log(e);
      log('ERRNOREADME', p, e);
      packageErrors.push(module);
      try {
        var options = require(module + '/package.json');
        var readme = readmeTemplate(options);
        if (o.write) fs.writeFileSync(p, readme);
      } catch (err) {
        console.log(err);
        log('ERRSHIIIIITNOPACKAGEJSONANDERRNOREADME', module, err);
      }
    }
  });

  return packageErrors;
}

if (require.main === module) {
  var args = require('subarg')(process.argv.slice(2));
  module.exports(args);
}
