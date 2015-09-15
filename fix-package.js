var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var defaults = require('defaults');
var clone = require('clone');
var includes = require('lodash.includes');
var dedupe = require('dedupe');

var log = require('./lib/utils').log;
var c = require('./config');

module.exports = function fix(o) {
  o = defaults(o, c);
  o.modules = o.modules || o._;

  console.log(chalk.bold.inverse.blue('glint fix-package:'));
  console.log();

  fixPackages(o);

};

function fixPackages(o) {

  var packageErrors = [];

  o.modules.forEach(function(module) {
    try {
      var package = require(module + '/package.json');
      var moduleName = extractModuleName(module);
      fixPackage(o, module, moduleName, package, o);
    } catch (err) {
      log('ERRORNOPACKAGEJSON', module);
      packageErrors.push(module);
    }
  });

  return packageErrors;
}

function fixPackage(o, modulePath, name, package) {
  log('START ' + name);

  var replace = vars(o.repo, name);

  function fixUrls() {
    package.repository = replace(o.repository);
    package.bugs = replace(o.bugs);
    package.homepage = replace(o.homepage);
  }

  if (package.name !== name) {
    log('fixed inconsistent package name', package.name + ' -> ' + name);
    package.name = name;
  }

  if (!package.version) {
    package.version = o.version;
    log('inserted missing version', o.version);
  }

  if (!package.repository || !package.bugs || !package.homepage) {
    fixUrls();
    log('inserted missing repository', package.repository);

  } else if (package.repository.url.indexOf(name) < 0) {
    fixUrls();
    log('fixed wrong repository url name', package.repository);

  } else if (package.repository.url.indexOf('/' + o.repo + '/') < 0) {
    fixUrls();
    log('fixed wrong repository in repository url', package.repository);
  }

  if (!package.author) {
    package.author = o.author;
    log('inserted missing author', o.author);
  }
  if (package.author !== o.author) {
    log('different author detected:', package.author + ' instead of ', o.author);
  }

  if (!package.license) {
    package.license = o.license;
    log('inserted missing license', o.license);
  }
  if (package.license !== o.license) {
    log('different license detected:', package.license + ' instead of ', o.license);
  }

  if (!package.keywords) {
    package.keywords = [];
    log('inserted missing keywords array');
  }
  nameSegments(name).forEach(function(keyword) {
    if (!includes(package.keywords, keyword)) {
      package.keywords.push(keyword);
      log('inserted keyword', keyword);
    }
  });
  dedupe(package.keywords);

  if (o.write) {
    log('END ' + name + ' WRITTEN package.json');
    fs.writeFileSync(modulePath + '/package.json', JSON.stringify(package, null, 2));
  } else {
    log('END ' + name + ' DRYRUN only, package.json was not saved');
  }

}

function vars(repo, name) {

  log('vars', repo, name);

  return function _replace(template) {
    var str = clone(template);

    if (typeof str === 'string') {
      return str.replace(':repo', repo).replace(':name', name);
    }
    if (typeof str === 'object') {
      Object.keys(str).forEach(function(key) {
        var value = str[key];
        str[key] = value.replace(':repo', repo).replace(':name', name);
      });
    }
    return str;
  }

}

function extractModuleName(module) {
  return module.split(path.sep).pop();
}

function nameSegments(name) {
  return name.split(/[_.-]/);
}

if (require.main === module) {
  var args = require('subarg')(process.argv.slice(2));
  module.exports(args);
}
