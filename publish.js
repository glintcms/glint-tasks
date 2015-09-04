require('shelljs/global');
var defaults = require('defaults');
var sprintf = require('sprintf-js').sprintf;

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
 * @param options:  { pwd, user, password, repo, org, tag }
 */
module.exports = function publish(o) {
  var options = defaults(options, o);

  var cmds = [];
  var cmd = '';

  pwd();
  if (options.pwd) {
    cd(options.pwd);
  }
  pwd();

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
    result = exec(cmd);
    if (!result || result.code !== 0) {
      echo('ERROR', cmd);
      exit(1);
    }
  });

};


if (require.main === module) {
  // node publish.js --pwd ../glint-util  --password donotshareyourpassword --user andineck --repo glint-util --org glintcms --tag 1.0.0
  var args = require('minimist')(process.argv.slice(2));
  module.exports(args);
}
