var path = require('path');
var fs = require('fs');

var base64Img = require('base64-img');
var unifyUrl = require('../unifyUrl');

module.exports = function (elem, fileDir, config) {
  var tagName = elem[0].tagName.toLowerCase();
  if(tagName !== 'img') return;
  
  // 资源路径
  var url = elem.attr('src');
  url = unifyUrl(url);
  // 资源的绝对路径
  var asset_path = path.resolve(fileDir, url);
  // 资源的内容, Buffer形式
  var base64Result = base64Img.base64Sync(asset_path);
  elem.attr('src', base64Result);
}