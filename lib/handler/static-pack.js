var CDNRepo = {
  amui: 'https://a.alipayobjects.com/amui/native/9.0/amui.css',
  zepto: 'https://a.alipayobjects.com/amui/zepto/1.1.3/zepto.js',
  antBridge: 'https://a.alipayobjects.com/publichome-static/antBridge/antBridge.min.js',
  fastclick: 'https://a.alipayobjects.com/static/fastclick/1.0.6/fastclick.min.js',
  lazyload: 'https://a.alipayobjects.com/static/lazyload/2.0.3/lazyload.min.js'
};
var _ = require('lodash');
var tagUrl = {
  link: 'href',
  script: 'src'
};

// 通过文件标示符将src替换为指定的地址
module.exports = function (e, config){
  var replaceAttr = e.data('replace').split('-');
  var tagName = e[0].tagName.toLowerCase();
  // 标签对应放置URL的地方
  var urlAttr = tagUrl[tagName];

  var repo = _.cloneDeep(CDNRepo);
  _.merge(repo, config.staticUrl);

  if(repo[replaceAttr[1]]) {
    // 地址替换
    e.attr(urlAttr, CDNRepo[replaceAttr[1]]);
  }
}