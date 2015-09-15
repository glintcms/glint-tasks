/**
 * module dependencies
 */
var path = require('path');
var shell = require('shelljs');
var chalk = require('chalk');
var clone = require('clone');
var defaults = require('defaults');
var slice = require('sliced');
var series = require('run-series');
var requireomat = require('requireomat');

var c = require('./config');

/**
 *
 * @param o options: verbose, dryrun, remove, withoutDev, ignoreDirs, ignoreMatches, ignorePackages, saveDev, ignoreVersion, modules (alias: unnamed array)
 */
module.exports = function fix(o, callback) {

  /**
   * get options right
   */
  var options = clone(o);
  options = defaults(options, c);

  o.modules = o.modules || o._;
  var modules = options.modules;
  delete options.modules;

  console.log(chalk.bold.inverse.blue('glint fix-dependencies:'));
  console.log();
  console.log('working on modules:', modules);


  /**
   * define tasks.
   *
   * @param cb callback
   */

  var tasks = [];

  modules.forEach(function(m){

    var opts = clone(options);
    opts.dir = m;
    delete options._; // would otherwise overwrite dir

    function task (cb) {
      requireomat(opts, cb);
    }
    tasks.push(task);

  });

  /**
   * execute tasks
   */

  series(tasks, function(err, result){
    if (callback) callback(err, result);
  });

};

/**
 * run from command line
 */
if (require.main === module) {
  var args = require('subarg')(process.argv.slice(2));
  module.exports(args, function(err, result){
    var code = (err) ? -1 : 0;
    process.exit(code);
  });
}
