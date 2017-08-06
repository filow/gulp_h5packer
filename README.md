# gulp-inline-src

资源内联插件，对html或js中引用的外部资源通过内联方式嵌入

## 快速开始

### html中内联

  - 样式

    ```html
    <link rel="stylesheet" type="text/css" href="animate.css" data-inline="true">
    ```

    内联CDN资源

    ```html
    <link rel="stylesheet" type="text/css" href="animate.css" data-inline="true" data-inline="static-animate">
    ```

    参数

    ```js
    {
      staticUrl: {
        animate: 'http://apps.bdimg.com/libs/animate.css/3.1.0/animate.min.css'
      }
    }
    ```

  - 脚本

    ```html
    <script src="zepto.js" data-inline="true"></script>
    ```

    内联CDN资源

    ```html
    <script src="zepto.js" data-inline="true" data-inline="static-zepto"></script>
    ```

    参数

    ```js
    {
      staticUrl: {
        zepto: 'http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js'
      }
    }
    ```

  - 图片

  ```html
  <img src="fake.png" data-inline="base64">
  ```

  > 注：目前Base64转码不考虑文件大小因素，请不要在大图片上加这个标记！

### 脚本中内联

  ```js
  __inline("./plugin/tinymce-plugin-autosave.js")
  var uploadTpl = __inline('./tpls/upload.html');
  var EDITOR_CONFIG = __inline('./config/config.json');
  ```

## 引用

  ```js
  let inline = require('gulp-inline-src');
  gulp.task('inline', function (){
    var options = {
      staticUrl: {
        animate: 'http://apps.bdimg.com/libs/animate.css/3.1.0/animate.min.css'
        ,zepto: 'http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js'
      }
    };
    gulp.src('./index.html')
    .pipe(inline(options))
    .pipe(gulp.dest('./public'));
  })
  ```

## 参数

| 属性 | 描述 | 是否必须 | 值类型 | 默认值 |
|---- |:-------------:|:----:|:----:| ----:| 
| `htmlTag` | 用于识别的属性 | 否 | {String} | "inline" |
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

## 版本

- 0.4.2: 新增`__inline`语法，支持在脚本中内联外部js或html资源

- 0.4.1: 修改代码仓库名称

- 0.4.0: 基于`filow/gulp_h5packer`0.3.0版本进行优化与bug修复
  - 解决关闭压缩后注入空脚本问题
  - 解决压缩es2015规范代码异常
  - 解决`htmlTag`配置变更后`staticUrl`替换失败问题
  - 增加压缩是否采用严格模式配置
  - 修改`htmlTag`默认值为`inline`




