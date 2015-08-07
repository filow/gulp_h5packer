var assert = require('assert');
var parseHelper = require('./helper/parseHelper');

describe('静态资源URL替换功能', function (){
  it('#Link', function(done) {

    parseHelper('<link rel="stylesheet" href="amui.css" data-replace="static-amui" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<link rel="stylesheet" href="https://a.alipayobjects.com/amui/native/9.0/amui.css">');
      done();
    });
  });

  it('#script', function(done) {
    parseHelper('<script src="lazyload.min.js" charset="utf-8" data-replace="static-lazyload"></script>', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<script src="https://a.alipayobjects.com/static/lazyload/2.0.3/lazyload.min.js" charset="utf-8"></script>');
      done();
    });
  });

});