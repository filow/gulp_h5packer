var fs = require('fs');
var os = require('os');
var crypto = require('crypto');
var request = require('request')

var tmpDir = os.tmpdir() + "h5packer-downloads";
function download(url, cb){
  var ext = url.split('.').pop();
  // 对URL做哈希
  md5 = crypto.createHash('md5');
  md5.update(url)
  file_name = md5.digest('hex') + '.' + ext;

  var full_path = tmpDir + '/' + file_name;
  if(!fs.existsSync(full_path)){
    // 如果文件不存在才下载
    console.log(full_path)
    var file = fs.createWriteStream(full_path);
    console.log("Downloading Remote Resource: "+url);
    request.get(url).pipe(file)
    file.on('end', function (){
      cb(full_path);
    })
  }else {
    cb(full_path);
  }



};


module.exports = function (url, cb){
  // 如果是一个http url
  if(/^http(s)?:\/\//.test(url)){
    if(!fs.existsSync(tmpDir)){
      fs.mkdir(tmpDir);
    }
    // 下载并返回文件路径
    download(url, cb);
  }else {
    cb(url);
  }
}
