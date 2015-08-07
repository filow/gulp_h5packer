var packer = require('../../');
var File = require('vinyl');


module.exports = function parseHelper(rawHtml, cb, config) {
  var fakeFile = new File({
    cwd: "./",
    base: "./test/",
    path: "./test/fake.html",
    contents: new Buffer(rawHtml)
  });
  var packerInstance = packer(config);
  packerInstance.write(fakeFile);

  packerInstance.once('data', cb);

}