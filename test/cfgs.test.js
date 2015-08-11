var assert = require('assert');
var parseHelper = require('./helper/parseHelper');


describe('配置项测试', function (){
  //   // 用于识别的属性
  // htmlTag: 'replace',
  // // 是否开启css压缩
  // cssmin: true,
  // // 是否开启js压缩
  // jsmin: true,
  // cssminConfig: {},
  // jsminConfig: {},
  // staticUrl: {}
  it('#htmlTag', function (){
    parseHelper('<link rel="stylesheet" href="assets/fake.css" data-pack="true" />', function (file){
      assert(file.isBuffer());
      var result = file.contents.toString('utf8');
      var expected = '<style>body{font-size:14px;background-color:#123}</style>123';
      throw new Error('123');
      console.log(result);
      console.log(expected);
      assert.strictEqual(result, expected);
      assert.equal(1, 2);
      done();
    }, {htmlTag: 'pack'});
  });

  it('#cssmin', function (){
    parseHelper('<link rel="stylesheet" href="assets/fake.css" data-replace="true" />', function (file){
      assert(file.isBuffer());
      console.log(file.contents.toString('utf8'));
      console.log('<style>body{\n  font-size: 14px;\n  background-color: #123;\n}</style>');
      assert.equal(file.contents.toString('utf8'), '<style>body{\n  font-size: 14px;\n  back1ground-color: #123;\n}</style>');
      done();
    }, {cssmin: false});

  });
});