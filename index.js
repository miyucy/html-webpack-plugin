'use strict';
var fs   = require('fs');
var path = require('path');
var _    = require('lodash');
var mkdirp = require('mkdirp');

function HtmlWebpackPlugin(options) {
  this.options = options || {}; // template, filename
  if (!this.options.template) {
    throw new Error('HtmlWebpackPlugin: `template` must be specified');
  }
}

HtmlWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('done', function(stats) {
    var params = stats.toJson({modules:false, source:false});
    var tmplfn = path.join(compiler.options.context, self.options.template);
    var output = path.join(compiler.options.context, self.options.filename || 'index.html');
    var writeFile = function(output, tmpl) {
      fs.writeFile(output, tmpl(params), function(err) {
        if (err) { throw new Error('HtmlWebpackPlugin: cannot write to: ' + output); }
      });
    };
    // self.debug(compiler, params);
    fs.readFile(tmplfn, { encoding: 'utf8' }, function(err, data) {
      if (err) {
        throw new Error('HtmlWebpackPlugin: cannot read ' + tmplfn);
      } else {
        var tmpl = _.template(data);
        var dir = path.dirname(output);
        if (!fs.existsSync(dir)) {
          mkdirp(dir, function (err) {
            if (err) { throw new Error('HtmlWebpackPlugin: cannot create dir: ' + dir); }
            writeFile(output, tmpl);
          });
        } else {
          writeFile(output, tmpl);
        }
      }
    });
  });
};

HtmlWebpackPlugin.prototype.debug = function(compiler, stats) {
  console.log('== stats ==');
  console.log(stats);
  console.log('== stats.chunks ==');
  for (var i=0; i<stats.chunks.length; i++) {
    console.log(stats.chunks[i]);
  }
  fs.writeFile(path.join(compiler.options.context, 'stats.json'), JSON.stringify(stats));
};

module.exports = HtmlWebpackPlugin;
