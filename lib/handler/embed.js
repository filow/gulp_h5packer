var path = require('path');
var fs = require('fs');

var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');

var unifyUrl = require('../unifyUrl');

// 处理文件内容的直接替换工具
var tagUrl = {
  link: 'href',
  script: 'src'
};
module.exports = function (elem, fileDir) {
  var tagName = elem[0].tagName.toLowerCase();
  // 只允许处理link和script标签
  if(tagName !== 'link' && tagName !== 'script') return;
  // 标签对应放置URL的地方
  var urlAttr = tagUrl[tagName];
  // 资源路径
  var url = elem.attr(urlAttr);
  // 如果资源路径是一个http地址的话就下载过来
  url = unifyUrl(url);
  // 资源的绝对路径
  var asset_path = path.resolve(fileDir, url);
  // 资源的内容
  var asset_content = fs.readFileSync(asset_path, {encoding: 'utf8'});
  if(tagName == 'link'){
    asset_content = new CleanCSS().minify(asset_content).styles;
    // link标签,就在后面生成一个style标签，去掉自身
    asset_content = '<style>' + asset_content + '</style>';
    elem.after(asset_content);
    elem.remove();
  }else if(tagName == 'script'){
    asset_content = UglifyJS.minify(asset_content, {fromString: true});
    // script标签去除src和data-replace后，在内部添加内容
    elem[0].innerHTML = asset_content.code;
    elem.removeAttr('src');
  }
}