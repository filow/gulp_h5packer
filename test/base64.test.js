var assert = require('assert');
var parseHelper = require('./helper/parseHelper');


describe('图片BASE64功能', function (){
  it('#本地图片', function(done) {
    parseHelper('<img src="assets/fake.png" data-replace="base64">', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEXu7AAAqu53V3L/AAAAFUlEQVR4AWNghAIGKKC3ABoYaPcAAEUQAIFcwTR+AAAAAElFTkSuQmCC">');
      done();
    });
  });

  it('#网络图片', function (done) {
    parseHelper('<img src="https://t.alipayobjects.com/images/rmsweb/T1eIXhXlxiXXXXXXXX.png" data-replace="base64">', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEXu7AAAqu53V3L/AAAAFUlEQVR4AWNghAIGKKC3ABoYaPcAAEUQAIFcwTR+AAAAAElFTkSuQmCC">');
      done();
    });
  });

});