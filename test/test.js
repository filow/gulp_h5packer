var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');

var packer = require('../');

function htmlWrapper(head, body){
  if(!head){head = ''}
  if(!body){body = ''}
  return '<html><head>'+head+'</head><body>'+body+'</body></html>';
}

function parseHelper(rawHtml, cb) {
  var fakeFile = new File({
    cwd: "./",
    base: "./test/",
    path: "./test/fake.html",
    contents: new Buffer(htmlWrapper(rawHtml))
  });
  var packerInstance = packer();
  packerInstance.write(fakeFile);

  packerInstance.once('data', cb);

}
describe('静态资源URL替换功能', function (){
  it('#Link', function(done) {

    parseHelper('<link rel="stylesheet" href="amui.css" data-replace="static-amui" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper('<link rel="stylesheet" href="https://a.alipayobjects.com/amui/native/9.0/amui.css">'));
      done();
    });
  });

  it('#script', function(done) {
    parseHelper('<script src="lazyload.min.js" charset="utf-8" data-replace="static-lazyload"></script>', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper('<script src="https://a.alipayobjects.com/static/lazyload/2.0.3/lazyload.min.js" charset="utf-8"></script>'));
      done();
    });
  });

});


describe('文件内容嵌入功能', function (){
  it('#本地css文件', function(done) {
    parseHelper('<link rel="stylesheet" href="assets/fake.css" data-replace="true" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper('<style>body{font-size:14px;background-color:#123}</style>'));
      done();
    });
  });

  it('#网络CSS文件', function (done) {
    parseHelper('<link rel="stylesheet" href="https://t.alipayobjects.com/images/rmsweb/T1oIphXmRgXXXXXXXX.css" data-replace="true" />', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper('<style>body{font-size:14px;background-color:#123}</style>'));
      done();
    });
  });


  it('#本地js文件', function(done) {
    parseHelper('<script src="assets/fake.js" data-replace="true"></script>', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper('<script>!function(o){o.console.log("Test")}(window);</script>'));
      done();
    });
  });

});

describe('图片BASE64功能', function (){
  it('#本地图片', function(done) {
    parseHelper('<img src="assets/fake.png" data-replace="base64">', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper(null, '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEXu7AAAqu53V3L/AAAAFUlEQVR4AWNghAIGKKC3ABoYaPcAAEUQAIFcwTR+AAAAAElFTkSuQmCC">'));
      done();
    });
  });

  it('#网络图片', function (done) {
    parseHelper('<img src="https://t.alipayobjects.com/images/rmsweb/T1eIXhXlxiXXXXXXXX.png" data-replace="base64">', function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper(null, '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEXu7AAAqu53V3L/AAAAFUlEQVR4AWNghAIGKKC3ABoYaPcAAEUQAIFcwTR+AAAAAElFTkSuQmCC">'));
      done();
    });
  });

});

describe('vm文件支持', function (){
  
  it('#velocity', function(done) {
    parseHelper("<h1>$!title</h1>\n#if($item == 'something')\n<br>#end", function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), htmlWrapper(null, "<h1>$!title</h1>\n#if($item == 'something')\n<br>#end"));
      done();
    });
  });

});