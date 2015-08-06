var path = require('path');
var fs = require('fs');

var base64Img = require('base64-img');
var unifyUrl = require('../unifyUrl');

module.exports = function (elem, fileDir) {
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
  //   // script标签去除src和data-replace后，在内部添加内容
  //   elem[0].innerHTML = asset_content.code;
  //   elem.removeAttr('src');
}