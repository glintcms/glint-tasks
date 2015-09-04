var chalk = require('chalk');

var sprintf = require('sprintf-js').sprintf;

if (require.main === module) {
  console.log(chalk.inverse("process.argv(slice2);"), process.argv.slice(2));
  console.log(chalk.inverse("require('minimist')(process.argv.slice(2));"), require('minimist')(process.argv.slice(2)));
  console.log(chalk.inverse("require('subarg')(process.argv.slice(2));"), require('subarg')(process.argv.slice(2)));

  var options = require('minimist')(process.argv.slice(2));
  console.log('options', options);

  console.log(sprintf('%(name)s', {'name': 'abc'}));
  console.log(sprintf('curl -u %(user)s:%(password)s https://api.github.com/orgs/%(org)s/repos -d \'{"name":"%(repo)s"}\'', options));

}


//var spawns = require('spawns');
//require('shelljs/global');
//
//console.log('dir before', __dirname, process.cwd());
////cd('../');
//
//var commands = []
//
//exec('cd ../ && export PWD=$(pwd)');
//
//console.log('dir after', __dirname, process.cwd());
//
//if (!which('git')) {
//  echo('Sorry, this script requires git');
//  exit(1);
//}
//
//if (exec('git tag').code !== 0) {
//  echo('Error: Git tag failed');
//  exit(1);
//}
//
////var exec = require('child_process').exec,
////  child;
////
////child = exec('cd ../ && pwd',
////  function(error, stdout, stderr) {
////    if (error !== null) {
////      console.log('exec error: ' + error);
////    }
////    console.log('stderr: ' + stderr);
////    console.log('stdout: ' + stdout);
////
////    console.log('dir after', __dirname, process.cwd());
////
////    process.chdir('../');
////
////
////    console.log('dir aaaafter', __dirname, process.cwd());
////  });
//
////spawns([
////  'pwd',
////  'cd ../',
////  'pwd',
////  'export DEBUG=halloo',
////  'echo $DEBUG'
////
////], {
////  stdio: 'inherit'
////
////}).on('data', function(data) {
////    console.log('stdout: ' + data);
////  })
////  .on('close', function(code, signal) {
////    console.log('close with code:', code);
////    console.log('close with signal:', signal);
////
////
////    console.log('dir after', __dirname, process.cwd());
////
////    process.chdir('../');
////
////
////    console.log('dir aaaafter', __dirname, process.cwd());
////  });