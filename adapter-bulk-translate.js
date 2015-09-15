/*
 # example:
 # cd into your project folder
 node node_modules/glint-tasks/adapter-bulk-translate.js --provider fs --db glint --type project --from de-ch --to de
 */

var Adapter = require('glint-adapter');
var localeMixin = require('./adapter-mixin-locale');
var each = require('async').each;

/**
 *
 * @param o Options: use help
 * @param callback
 */
module.exports = function translate(o, callback) {

  var Provider = require('glint-adapter-' + o.provider);
  var adapter = Adapter(Provider()).db(o.db).type(o.type).mixin(localeMixin);

  adapter.findWithLocale(o.from, function(err, records) {
    if (err) return callback(err);

    each(
      records,
      function(record, next){
        // transform
        record.locale = o.to;
        if (record.id && record.path) record.id = record.locale + '-' + record.path;
        console.log('record', record);

        // save
        adapter.save(record.id, record, next);

      },
      function(err, result) {
        if (err) return callback(err);
      }
    );
  })

};


if (require.main === module) {
  var args = require('subarg')(process.argv.slice(2));
  help(args);

  module.exports(args, function(err, result) {
    var code = (err) ? -1 : 0;
    process.exit(code);
  });
}

function help(argv) {
  if (argv.version || argv.v) {
    console.log(require('package').version);
    process.exit();
  }
  if (argv.help || argv.h) {
    console.log('Usage:');
    console.log('');
    console.log('translate --provider <provider> --db <db> --type <type> --from <locale> --to <locale>');
    console.log('');
    console.log('Example:');
    console.log('')
    console.log('translate --provider fs --db glint --type articles --from "de-ch" --to "en"')
    process.exit();
  }
}