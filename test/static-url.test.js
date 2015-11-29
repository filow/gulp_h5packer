var assert = require('assert');
var parseHelper = require('./helper/parseHelper');

describe('静态资源URL替换功能', function (){
  it('#Link', function(done) {

    parseHelper('<link rel="stylesheet" href="amui.css" data-replace="static-test" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<link rel="stylesheet" href="http://test.com/a.css">');
      done();
    });
  });

  it('#script', function(done) {
    parseHelper('<script src="lazyload.min.js" charset="utf-8" data-replace="static-test"></script>', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<script src="http://test.com/a.css" charset="utf-8"></script>');
      done();
    });
  });

});
