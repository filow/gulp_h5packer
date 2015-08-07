var assert = require('assert');
var parseHelper = require('./helper/parseHelper');


describe('文件内容嵌入功能', function (){
  it('#本地css文件', function(done) {
    parseHelper('<link rel="stylesheet" href="assets/fake.css" data-replace="true" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<style>body{font-size:14px;background-color:#123}</style>');
      done();
    });
  });

  it('#网络CSS文件', function (done) {
    parseHelper('<link rel="stylesheet" href="https://t.alipayobjects.com/images/rmsweb/T1oIphXmRgXXXXXXXX.css" data-replace="true" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<style>body{font-size:14px;background-color:#123}</style>');
      done();
    });
  });


  it('#本地js文件', function(done) {
    parseHelper('<script src="assets/fake.js" data-replace="true"></script>', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<script>!function(o){o.console.log("Test")}(window);</script>');
      done();
    });
  });

});