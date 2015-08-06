var fs = require('fs');
var jsdom = require('jsdom');
var path = require('path');

var embed = require('./handler/embed.js');
var static_pack = require('./handler/static-pack.js');
var base64 = require('./handler/base64.js');

function rawReplace(filePath, fileContents, cb){
  // 文件的目录名
  var fileDir = path.dirname(filePath);
  jsdom.env(fileContents, function (error, window){
    // 生成jq对象
    var $ = require('jquery')(window);
    $('[data-replace]').each(function (index,elem){
      var e = $(elem);
      var replaceAttr = e.data('replace');
      // 只处理这个属性有值的情况
      if(!replaceAttr) return;
      if(replaceAttr === true){
        embed(e, fileDir);
      }else if(replaceAttr === "base64") {
        // 将图片通过base64转码并直接嵌入src中
        base64(e, fileDir);
      }else if(replaceAttr.indexOf("static")>=0){
        // 静态资源包
        static_pack(e);
      }
      e.removeAttr('data-replace');
      
    });
    cb(window.document.documentElement.outerHTML);
  });

}


function replace(file, cb) {
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
