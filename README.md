# gulp-h5packer

移动H5页面打包工具

为了减少移动端H5页面的请求数量，往往会在发布前将页面依赖的JS, CSS文件嵌入html中，如果一些资源有全局资源包的支持，也会将其替换为CDN地址。

本插件可以根据link, script, img标签中的标记，选择将文件内容嵌入或者替换为CDN地址。

## 关键版本节点

0.2.0: 替换HTML解析引擎为cheerio，提升2倍以上的效率
       增加对配置项的支持

0.1.7: 可以支持网络文件的嵌入和BASE64

0.1.6: 支持img标签内图片的BASE64, 支持js和CSS的压缩


## 用法

首先，在待处理的html文件中加入标记。标记共有三种：

### 内容替换标记

```html
<link rel="stylesheet" type="text/css" href="something.css" data-replace="true">
<script src="something.js" data-replace="true"></script>
```

这样会读取资源文件，把内容嵌入在标签的位置。script标签会删去src和data-replace属性，并在标签内嵌入内容。link标签会在后面产生一个style节点，并嵌入内容。标签本身会被删除。

目前插件会自动压缩css和js文件，未来可以通过配置文件取消这一功能。

### 资源URL替换标记

```html
<link rel="stylesheet" type="text/css" href="local/amui.css" data-replace="amui">
<script src="zepto.js" data-replace="static-zepto"></script>
```

在data-replace中写入"static-全局资源包名称"，即可替换为相应的地址。

目前支持以下资源：

```js
{
  amui: 'https://a.alipayobjects.com/amui/native/9.0/amui.css',
  zepto: 'https://a.alipayobjects.com/amui/zepto/1.1.3/zepto.js',
  antBridge: 'https://a.alipayobjects.com/publichome-static/antBridge/antBridge.min.js',
  fastclick: 'https://a.alipayobjects.com/static/fastclick/1.0.6/fastclick.min.js',
  lazyload: 'https://a.alipayobjects.com/static/lazyload/2.0.3/lazyload.min.js'
}
```
具体的列表可以看[h5全局离线资源包](http://ux.alipay-inc.com/index.php/H5%E5%85%A8%E5%B1%80%E7%A6%BB%E7%BA%BF%E8%B5%84%E6%BA%90%E5%8C%85)

### 图片Base64转化标记
```html
<img src="fake.png" data-replace="base64">
```
注意： 目前Base64转码不考虑文件大小因素，请不要在大图片上加这个标记！

## 引用
设置完HTML后，在gulpfile.js中引用：
```js
gulp.task('pack', function (){
  var replacer = require('@alipay/gulp-h5replacer');
  gulp.src('./build/*/*.html')
    .pipe(replacer())
    .pipe(gulp.dest('./pack'));
});
```

## Todo
1. 将文件引用的图片和无法嵌入的资源文件自动上传到蜻蜓上
2. 增加配置选项
3. 支持CSS内的图片BASE64
