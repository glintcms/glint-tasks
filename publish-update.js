/*
 examples:
 node publish-update.js --pwd ../ --message 'updated dependencies' glint-adapter glint-adapter-ajax glint-adapter-elasticsearch glint-adapter-fs glint-block glint-block-ckeditor glint-block-image glint-block-image-attribute glint-block-markdown glint-block-meta glint-block-text glint-container glint-i18n glint-plugin-adapter-dates glint-plugin-adapter-expires glint-plugin-adapter-id glint-plugin-adapter-locale glint-plugin-block-style-editable glint-plugin-wrap-container-place glint-plugin-wrap-i18n glint-plugin-wrap-locale glint-session glint-socket-io glint-static glint-tasks glint-trigger glint-trigger-keyboard glint-trigger-sidenav glint-util glint-widget glint-wrap
 node publish-update.js --version patch --message 'adds adapter provider mixin' /Users/andineck/Development/github/glint-adapter /Users/andineck/Development/github/glint-adapter-ajax

 */

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
  var result2 = exec('git commit --dry-run --porcelain');

  if (result && result.output || result2 && result2.output) {
    console.log('found local changes', result.output);
    console.log('found uncommited changes', result2.output);
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
  var args = require('subarg')(process.argv.slice(2));
  module.exports(args);
}
