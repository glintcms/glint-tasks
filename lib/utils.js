var chalk = require('chalk');
var slice = require('sliced');

exports.log = function log(title) {
  var args = slice(arguments, 1);
  console.log(chalk.bold.white.bgCyan(title));

  args.forEach(function(arg){
    var line = arg;
    if (typeof arg === 'object') {
      try{
        line = JSON.stringify(arg, null, 2);
      }  catch (e) {
        line = arg;
      }
    }
    console.log(chalk.gray(line));
  });

  console.log('');
};
