var CDNRepo = {
  test: 'http://test.com/a.css'
};
var _ = require('lodash');
var tagUrl = {
  link: 'href',
  script: 'src'
};

// 通过文件标示符将src替换为指定的地址
module.exports = function (e, config){ 
  var replaceAttr = e.data(config.htmlTag).split('-');
  var tagName = e[0].tagName.toLowerCase();
  // 标签对应放置URL的地方
  var urlAttr = tagUrl[tagName];

  var repo = _.cloneDeep(CDNRepo);
  _.merge(repo, config.staticUrl);
  console.log(repo[replaceAttr[1]]);
  if(repo[replaceAttr[1]]) {
    // 地址替换
    e.attr(urlAttr, repo[replaceAttr[1]]);
  }
}
