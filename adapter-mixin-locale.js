module.exports = {
  fs: {
    findWithLocale: function(locale, fn) {
      var query = 'this.id.indexOf("__template__") === -1 && this.locale === "' + locale + '"';
      this.find({$where: query}, fn);
    }
  }
};
