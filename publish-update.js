require('shelljs/global');
var clone = require('clone');
var sprintf = require('sprintf-js').sprintf;
var chalk = require('chalk');


module.exports = function publish(o) {
  var options = clone(o);
  options.repos = options.repos || options._;

  if (options.pwd) {
    cd(options.pwd);
  }
  var baseDirectory = pwd();
  console.log('base directory:', baseDirectory);

  options.repos.forEach(function(repo) {
    var optionsSingle = clone(options);
    optionsSingle.repo = repo;
    try {
      cd(baseDirectory);
      publishSingle(optionsSingle);
    } catch (err) {
      console.error('ERROR processing repo: ' + repo + ' | ERROR MESSAGE: ' + err.message)
    }
  });

};

function publishSingle(options) {

  var cmds = [];
  var cmd = '';

  cd(options.repo);
  var workingDirectory = pwd();
  console.log(chalk.inverse('working directory:'), workingDirectory);

  // check for uncommitted changes
  var result = exec('git add -A -n');
  console.log('check:', result);
  if (result && result.output) {
    console.log('found uncommited changes', result.output);
    if (options.dryrun) {
      return;
    }


    // commit
    var message = options.message || 'work in progress';
    result = exec('git add -A && git commit -m "' + message + '"');
    if (!result || result.code !== 0) {
      console.error('could commit changes');
      return;
    }

    // push version
    var version = options.version || 'patch';
    result = exec('npm version ' + version);
    if (!result || result.code !== 0) {
      console.error('could not set new version');
      return;
    }

    // push new commits to github repo
    result = exec('git push && git push --tags');
    if (!result || result.code !== 0) {
      console.error('could push changes to github upstream');
      return;
    }

    // publish to npm
    result = exec('npm publish');
    if (!result || result.code !== 0) {
      console.error('could publish new version to npm');
      return;
    }
  } else {
    console.log('no changes found.');
  }

}

if (require.main === module) {
  // node publish.js --pwd ../ --password donotshareyourpassword --user andineck --org glintcms --tag 1.0.0 glint-util glint-tasks
  var args = require('minimist')(process.argv.slice(2));
  module.exports(args);
}
