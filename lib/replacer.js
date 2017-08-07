var fs = require('fs');
// var jsdom = require('jsdom');
var path = require('path');

var cheerio = require('cheerio');

var embed = require('./handler/embed.js');
var static_pack = require('./handler/static-pack.js');
var base64 = require('./handler/base64.js');
var _ = require('lodash');
var defaultConfigs = {
  // 用于识别的属性
  htmlTag: 'inline',
  // 是否开启css压缩
  cssmin: true,
  // 是否开启js压缩
  jsmin: true,
  // 是否严格模式
  strict: true,
  // 不压缩文件的文件夹
  ignoreCompressFolders: [],
  cssminConfig: {},
  jsminConfig: {},
  staticUrl: {}
};

function rawReplace(filePath, fileContents, cfg, cb){
  var config = _.cloneDeep(defaultConfigs);
  _.merge(config, cfg);
  // 文件的目录名
  var fileDir = path.dirname(filePath);
  var $ = cheerio.load(fileContents, {decodeEntities: false});

  var field = '[data-' + config.htmlTag + ']';
  $(field).each(function (index,elem){
    var e = $(elem);
    var replaceAttr = e.data(config.htmlTag);
    // 只处理这个属性有值的情况
    if(!replaceAttr) return;
    if(replaceAttr === true){
      embed(e, fileDir, config);
    }else if(replaceAttr === "base64") {
      // 将图片通过base64转码并直接嵌入src中
      base64(e, fileDir, config);
    }else if(replaceAttr.indexOf("static")>=0){
      // 静态资源包
      static_pack(e, config);
    }
    e.removeAttr('data-' + config.htmlTag);
    
  });
  cb($.html());

}


function replace(file, cfg, cb) {
  var ext = path.extname(file).toLowerCase();
  if(ext !== '.html' && ext !== '.vm'){
    cb('不支持的文件类型: ' + ext + ', Only: (html, vm)');
  }

  // 读取目标文件
  var fileContents = fs.readFileSync(file, {encoding: 'utf-8'});

  rawReplace(file, fileContents, function (result){
    cb(null, result);
  });
  
  
  
}

exports.RawReplacer = rawReplace;
exports.Replacer = replace;
