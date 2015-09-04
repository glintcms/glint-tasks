require('shelljs/global');
var clone = require('clone');
var sprintf = require('sprintf-js').sprintf;
var chalk = require('chalk');

/**
 *
 cd PWD
 curl -u USER:PASSWORD https://api.github.com/orgs/ORG/repos -d '{"name":"REPO"}'
 git init
 git add -A
 git commit -m initial
 git remote add origin https://github.com/ORG/REPO.git
 git push -u origin master

 git tag TAG
 git push --tags

 npm publish
 *
 * @param options:  { user, password, repo, org, tag, _: [directories array] }
 */
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

  if (options.org) {
    cmd = sprintf('curl -u %(user)s:%(password)s https://api.github.com/orgs/%(org)s/repos -d \'{"name":"%(repo)s"}\'', options);
  } else {
    options.org = options.user;
    cmd = sprintf('curl -u %(user)s:%(password)s https://api.github.com/user/repos -d \'{"name":"%(repo)s"}\'', options);
  }

  cmds.push(cmd);
  cmds.push('git init');
  cmds.push('git add -A');
  cmds.push('git commit -m initial');
  cmds.push(sprintf('git remote add origin https://github.com/%(org)s/%(repo)s.git', options));
  cmds.push('git push -u origin master');

  if (options.tag) {
    cmds.push(sprintf('git tag %(tag)s', options));
    cmds.push('git push --tags');
  }
  cmds.push('npm publish');

  var result;
  cmds.forEach(function(cmd) {
    console.log(chalk.inverse('executing... ' + cmd));
    result = exec(cmd);
    if (!result || result.code !== 0) {
      throw new Error('ERROR CMD FAILED: ' + cmd);
    }
  });

}

if (require.main === module) {
  // node publish.js --pwd ../ --password donotshareyourpassword --user andineck --org glintcms --tag 1.0.0 glint-util glint-tasks
  var args = require('minimist')(process.argv.slice(2));
  module.exports(args);
}
