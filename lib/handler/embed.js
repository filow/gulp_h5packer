var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var unifyUrl = require('../unifyUrl');
var babel = require("babel-core");

// 处理文件内容的直接替换工具
var tagUrl = {
  link: 'href',
  script: 'src'
};
module.exports = function (elem, fileDir, config) {
  var tagName = elem[0].tagName.toLowerCase();
  // 只允许处理link和script标签
  if(tagName !== 'link' && tagName !== 'script') return;
  // 标签对应放置URL的地方
  var urlAttr = tagUrl[tagName];
  // 资源路径
  var url = elem.attr(urlAttr);
  // 如果资源路径是一个http地址的话就下载过来
  unifyUrl(url, function (u) {
    // 资源的绝对路径
    var asset_path = path.resolve(fileDir, u);
    // 是否忽略压缩的文件
    var ignore_min = false;
    // 不压缩文件的文件夹
    var ignoreCompressFolders = config.ignoreCompressFolders;
    // 是否不压缩
    if(Object.prototype.toString.call(ignoreCompressFolders) === '[object Array]' && ignoreCompressFolders.length){
      for(var i = ignoreCompressFolders.length - 1; i >= 0; i--){
        var item = "/" + ignoreCompressFolders[i] + "/";
        if(asset_path.indexOf(item) !== -1){
          ignore_min = true;
          break;
        }
      }
    }
    // 资源的内容
    var asset_content = fs.readFileSync(asset_path, {encoding: 'utf8'});
    if(tagName == 'link'){
      // console.log(config);
      var cssmin = config.cssmin && !ignore_min;
      if(cssmin){
        var CleanCSS = require('clean-css');
        asset_content = new CleanCSS(config.cssminConfig).minify(asset_content).styles;
      }
      // link标签,就在后面生成一个style标签，去掉自身
      asset_content = '<style>' + asset_content + '</style>';
      elem.after(asset_content);
      elem.remove();
    }else if(tagName == 'script'){
      var jsmin = config.jsmin && !ignore_min;
      // 是否使用严格模式
      var strict = config.strict;
      if(jsmin) {
        var UglifyJS = require("uglify-js");
        var presets = strict ? "es2015" : "es2015-without-strict";
        // 用babel转义，避免使用了es2015的语法导致压缩异常
        var asset_content = babel.transform(asset_content, {presets: [presets]}).code;
        asset_content = UglifyJS.minify(asset_content, _.merge(config.jsminConfig,{fromString: true})).code;
      }
      // script标签去除src和data-replace后，在内部添加内容
      // .html()方法会有很多多余的操作
      elem.text(asset_content);
      elem.removeAttr('src');
    }
  });
}
