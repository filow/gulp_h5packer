# gulp-inline-src

移动H5页面打包工具

为了减少移动端H5页面的请求数量，往往会在发布前将页面依赖的JS, CSS文件嵌入html中，如果一些资源有全局资源包的支持，也会将其替换为CDN地址。

本插件可以根据link, script, img标签中的标记，选择将文件内容嵌入或者替换为CDN地址。

## 关键版本节点

0.4.0: 基于`filow/gulp_h5packer`0.3.0版本进行优化与bug修复
  - 解决关闭压缩后注入空脚本问题
  - 解决压缩es2015规范代码异常
  - 解决`htmlTag`配置变更后`staticUrl`替换失败问题
  - 增加压缩是否采用严格模式配置
  - 修改`htmlTag`默认值为`inline`

0.3.0: 脱离支付宝H5开发环境独立发展

0.2.0: 替换HTML解析引擎为cheerio，提升2倍以上的效率
       增加对配置项的支持

0.1.7: 可以支持网络文件的嵌入和BASE64

0.1.6: 支持img标签内图片的BASE64, 支持js和CSS的压缩


## 用法

首先，在待处理的html文件中加入标记。标记共有三种：

### 内容替换标记

```html
<link rel="stylesheet" type="text/css" href="something.css" data-inline="true">
<script src="something.js" data-inline="true"></script>
```

这样会读取资源文件，把内容嵌入在标签的位置。script标签会删去src和data-inline属性，并在标签内嵌入内容。link标签会在后面产生一个style节点，并嵌入内容。标签本身会被删除。

### 资源URL替换标记

```html
<link rel="stylesheet" type="text/css" href="local/animate.css" data-inline="static-animate">
<script src="local/zepto.js" data-inline="static-zepto"></script>
```

在data-inline中写入"static-全局资源包名称"，即可替换为相应的地址。

该功能由于目前脱离了支付宝环境，暂时没有默认值，请在初始化参数中传入：
```js
{
  staticUrl: {
    animate: 'http://apps.bdimg.com/libs/animate.css/3.1.0/animate.min.css'
    ,zepto: 'http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js'
  }
}

```

### 图片Base64转化标记
```html
<img src="fake.png" data-inline="base64">
```
注意： 目前Base64转码不考虑文件大小因素，请不要在大图片上加这个标记！

## 引用
设置完HTML后，在gulpfile.js中引用：
```js
gulp.task('pack', function (){
  var inline = require('gulp-inline-src');
  gulp.src('./build/*/*.html')
    .pipe(inline())
    .pipe(gulp.dest('./public'));
});
```

## 参数

| 属性 | 描述 | 是否必须 | 值类型 | 默认值 |
|---- |:-------------:|:----:|:----:| ----:| 
| `htmlTag` | 用于识别的属性 | 否 | {String} | "replace" |
| `cssmin` | 是否开启css压缩 | 否 | {Boolean} | true |
| `jsmin` | 是否开启js压缩 | 否 | {Boolean} | true |
| `strict` | 是否使用严格模式 | 否 | {Boolean} | true |
| `ignoreCompressFolders` | 不压缩的文件夹 | 否 | {Array-String} | [] |
| `cssminConfig` | `clean-css`的配置 | 否 | {Object} | {} |
| `jsminConfig` | `uglify-js`的配置| 否 | {Object} | {} |
| `staticUrl` | `cdn`静态资源路径替换 | 否 | {Object} | {} |

> 注：
> - `clean-css`版本为`~3.3.7`
> - `uglify-js`版本为`~2.4.24`
