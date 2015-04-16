'use strict';
var fs   = require('fs');
var path = require('path');
var _    = require('lodash');

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
    // self.debug(compiler, params);
    fs.readFile(tmplfn, { encoding: 'utf8' }, function(err, data) {
      if (err) {
        throw new Error('HtmlWebpackPlugin: cannot read ' + tmplfn);
      } else {
        var tmpl = _.template(data);
        fs.writeFile(output, tmpl(params), function(err) {
          if (err) {
            throw new Error('HtmlWebpackPlugin: cannot write to ' + output);
          }
        });
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
