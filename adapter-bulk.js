///**
// *
// * API Ideas:
// *
// *  adapter-bulk --db glint --type [ article, articles ] --id de-ch --to de
// *
// * base library:
// *
// * adapter-bulk-operations:
// *
// * select: select db, type, id do work on json
// * act: copy ['de-*', 'en-*'], rename, edit
// * recepies:
// *
// */
//
//module.exports = function bulk(o, callback) {
//
//
//}
//
//
//if (require.main === module) {
//  var args = require('subarg')(process.argv.slice(2));
//  module.exports(args, function(err, result){
//    var code = (err) ? -1 : 0;
//    process.exit(code);
//  });
//}