var fs = require('fs');
var jsdom = require('jsdom');
var path = require('path');

var CDNRepo = {
  amui: 'https://a.alipayobjects.com/amui/native/9.0/amui.css',
  zepto: 'https://a.alipayobjects.com/amui/zepto/1.1.3/zepto.js',
  antBridge: 'https://a.alipayobjects.com/publichome-static/antBridge/antBridge.min.js',
  fastclick: 'https://a.alipayobjects.com/static/fastclick/1.0.6/fastclick.min.js',
  lazyload: 'https://a.alipayobjects.com/static/lazyload/2.0.3/lazyload.min.js'
};

var tagUrl = {
  link: 'href',
  script: 'src',
  img: 'src'
};
function rawReplace(filePath, fileContents, cb){
  // 文件的目录名
  var fileDir = path.dirname(filePath);
  jsdom.env(fileContents, function (error, window){
    // 生成jq对象
    var $ = require('jquery')(window);
    $('[data-replace]').each(function (index,elem){
      var e = $(elem),
          tagName = elem.tagName.toLowerCase();
          // 标签对应放置URL的地方
      var urlAttr = tagUrl[tagName],
          // 替换标志内容
          replaceAttr = e.data('replace');
      // 只处理这个属性有值的情况
      if(!replaceAttr) return;
      // 内容替换
      if(replaceAttr === true){
          // 资源路径
          var url = e.attr(urlAttr);
          // 资源的绝对路径
          var asset_path = path.resolve(fileDir, url);
          // 资源的内容
          var asset_content = fs.readFileSync(asset_path);
          if(tagName == 'link'){
            // link标签,就在后面生成一个style标签，去掉自身
            asset_content = '<style>' + asset_content + '</style>';
            e.after(asset_content);
            e.remove();
          }else if(tagName == 'script'){
            // script标签去除src和data-replace后，在内部添加内容
            elem.innerHTML = asset_content;
            e.removeAttr('src').removeAttr('data-replace');
          }

      }else if(CDNRepo[replaceAttr]){ 
        // 地址替换
        e.attr(urlAttr, CDNRepo[replaceAttr]);
        e.removeAttr('data-replace');
      }
      
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
