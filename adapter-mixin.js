var Query = require('mingo');

var mixins = {
  findWithTitle: function(title, fn) {
    var query = 'this.title.indexOf("' + title + '") !== -1';
    this.find({$where: query}, function(err, result) {
      result = result || [];
      var filtered = Query.find(result, {}).limit(3).all();
      return fn(err, {projects: filtered});
    });
  },
  findLatest: function(locale, number, fn) {
    var query = 'this.id.indexOf("__template__") === -1 && this.locale === "' + locale + '"';
    this.find({$where: query}, function (err, result) {
      result = result || [];
      var filtered = Query.find(result, {}).sort({'updatedAt': 1}).limit(number).all();
      return fn(err, {projects: filtered});
    });
  }
};

module.exports = function mixin(adapter) {
  return adapter.mixin(mixins);
};
