// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Buffer = require('buffer').Buffer;
var path = require('path');
var replacer = require('./lib/replacer').RawReplacer
var _ = require('lodash');
// Consts
const PLUGIN_NAME = 'gulp-h5replacer';


// Plugin level function(dealing with files)
function gulpH5Replacer(cfg) {
  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if(file.isStream()){
      this.emit('error',new PluginError(PLUGIN_NAME, ": Streaming not supported"));
      return cb(null, file);
    }
    console.log(PLUGIN_NAME + ': ' + file.path);
    

    if (file.isBuffer()) {
      var ext = path.extname(file.path).toLowerCase();
      if(ext !== '.html' && ext !== '.vm'){
        this.emit('error',new PluginError(PLUGIN_NAME, '不支持的文件类型: ' + ext + ', Only: (html, vm)'));
        return cb(null, file);
      }
      // 替换资源
      replacer(file.path, file.contents.toString(), cfg,  function (result){
        file.contents = new Buffer(result);
        cb(null, file);
        // console.log(file.contents.toString());
      });

    }

    // cb(null, file);

  });

}

// Exporting the plugin main function
module.exports = gulpH5Replacer;