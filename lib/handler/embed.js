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
      // 是否压缩
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
      // 脚本所在文件夹路径
      var script_path = path.dirname(asset_path);
      // 内联__inline标识资源
      asset_content = inlineSrc(asset_content, script_path);
      // 是否压缩
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

/**
 * 正则集
 * @attr code  匹配__inline代码 eg: __inline('./config/config.json')
 * @attr url   匹配__inline代码的路径 eg: "./config/config.json"
 */
var regexp = {
  // 匹配__inline代码
  code: new RegExp(/__inline\(.*?\)/, 'g')
  // 匹配__inline代码的路径
  ,url: new RegExp(/__inline\(['|"](.*)['|"]\)/)
}

/**
 * 获取inline资源绝对路径
 * @param {String} code "__inline"语句 eg: __inline('./config/config.json')
 * @param {String} fileDir 当前路径
 * @return {String} inline资源绝对路径
 */
function getUrl(code, fileDir){
  var ret = "";
  if(_.isString(code) && code.trim() !== '' && fileDir){
    var result = code.match(regexp.url);
    if(_.isArray(result) && result.length > 1){
      var _result = result[1];
      if(_.isString(_result) && _result.trim() !== ''){
        ret = path.resolve(fileDir, _result);
      }
    }
  }
  return ret;
}

/**
 * 获取文件类型
 * @param {String} url 资源文件绝对路径
 * @return {String} 文件类型
 */
function getFileType(url){
  var ret = "";
  if(_.isString(url) && url !== ''){
    var result = url.replace(/.+\./, "");
    if(result){
      ret = result.trim();
    }
  }
  return ret;
}
/**
 * 装饰资源文件文本
 * @param {String} content 资源文件文本
 * @return {String} 装饰后资源文件文本
 */
function decorateContent(content, url){
  var ret = content;
  var type = getFileType(url);
  switch(type){
    case 'html':
    case 'tpl':
      ret = "`" + content + "`";
      break;
  }
  return ret;
}

/**
 * 获取inline资源内容
 * @param {String} url 资源绝对路径
 * @return {String} inline资源内容
 */
function getContent(url){
  var ret = "";
  if(_.isString(url) && url.trim() !== ''){
    var options = {
      encoding: 'utf8'
    };
    var inline_content = fs.readFileSync(url, options);
    if(_.isString(inline_content)){
      ret = decorateContent(inline_content, url);
    }
  }
  return ret;
}

/**
 * 获取inline语句与对应资源的对照
 * @param {Array} inline_codes inline语句
 * @param {String} fileDir 当前路径
 * @return {Object} 
 */
function getInlineMap(inline_codes, fileDir){
  var ret = {}
  if(_.isArray(inline_codes) && inline_codes.length){
    inline_codes.forEach(function(code){
      if(code){
        var url = getUrl(code, fileDir);
        var cnt = getContent(url);
        ret[code] = cnt;
      }
    })
  }
  return ret;
}

/**
 * 根据inline语句生成正则表达式
 * @param {String} inline_code inline语句
 * @return {RegExp} 正则表达式 
 */
function getRegExp(inline_code){
  var ret = null;
  if(_.isString(inline_code) && inline_code !== ''){
    var result = inline_code.replace(/\(/g, "\\(");
    result = result.replace(/\)/g, "\\)");
    ret = new RegExp(result, 'g');
  }
  return ret;
}

/**
 * 将资源文本替换inline语句
 * @param {Object} inline_map 资源对照
 * @param {String} script 脚本源码
 * @return {String} script 替换资源本文后的脚本源码
 */
function replaceInlineCode(inline_map, script){
  if(_.isObject(inline_map) && Object.keys(inline_map).length && _.isString(script) && script !== ''){
    Object.keys(inline_map).forEach(function(inline_code){
      // 资源文本
      var cnt = inline_map[inline_code];
      // 正则表达式
      var reg = getRegExp(inline_code);
      if(reg){
        script = script.replace(reg, cnt);
      }
    });
  }
  return script;
}

/**
 * 内联"__inline"标识资源
 * @param {String} script 脚本源码
 * @param {String} fileDir 当前路径
 * @return {String} script 替换资源本文后的脚本源码
 */
function inlineSrc(script, fileDir){
  if(!script) return;
  // 提取__inline语句 eg: ["__inline('./config/config.json')", "__inline('components/teditor/teditor.html')"]
  var inline_codes = script.match(regexp.code);
  // 资源索引
  var inline_map = getInlineMap(inline_codes, fileDir);
  // 替换inline语句为对应资源文本
  if(inline_map) {
    script = replaceInlineCode(inline_map, script);
  }
  return script;
}
