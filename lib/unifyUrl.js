var fs = require('fs');
var os = require('os');
var crypto = require('crypto');
var spawn = require('child_process').spawnSync; 

var tmpDir = os.tmpdir() + "h5packer-downloads";
function download(url){
  var ext = url.split('.').pop();
  // 对URL做哈希
  md5 = crypto.createHash('md5');
  md5.update(url)
  file_name = md5.digest('hex') + '.' + ext;

  var full_path = tmpDir + '/' + file_name;
  if(!fs.existsSync(full_path)){
    // 如果文件不存在才下载
    var file = fs.createWriteStream(full_path); 
    console.log("Downloading Remote Resource: "+url); 
    var data = spawn('curl', [url]);
    fs.writeFileSync(full_path, data.stdout);
  }

  return full_path;
  
};


module.exports = function (url, cb){
  // 如果是一个http url
  if(/^http(s)?:\/\//.test(url)){
    if(!fs.existsSync(tmpDir)){
      fs.mkdir(tmpDir);
    }
    var file_name;
    // 下载并返回文件路径
    return download(url);
  }else {
    return url;
  }
}