var assert = require('assert');
var parseHelper = require('./helper/parseHelper');


describe('vm文件支持', function (){
  
  it('#velocity', function(done) {
    parseHelper("<h1>$!title</h1>\n#if($item == 'something')\n<br>#end", function (file){
      assert(file.isBuffer());
      assert.equal(file.contents.toString('utf8'), "<h1>$!title</h1>\n#if($item == 'something')\n<br>#end");
      done();
    });
  });

});

