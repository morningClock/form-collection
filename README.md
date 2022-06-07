# 表单收集平台

# 一、业务流程

![业务流程](images/业务流程.png)

# 二、需求分析

![功能分析](images/功能分析.png)

# 三、系统所有功能

## web端

- [x] 后台设置标题获取
- [x] 表单上传
- [x] 图片上传
- [x] 图片压缩

## 后台管理

- [x] 标题设置获取
- [x] 用户登录
- [x] 用户权限路由
- [x] 用户管理模块
	- [x] 用户列表
	- [x] 重置密码
- [x] 客户信息管理
	- [x] 用户信息表格
	- [x] 用户信息模糊查询
	- [x] 编辑/更新用户信息
	- [x] 信息状态改变
	- [x] 删除用户信息
	- [x] 导出所有数据为Excel
- [x] 系统设置
	- [x] 标题设置

## 服务端

用户模块：

- [x] 用户登录
- [x] 用户注册
- [x] 获取用户信息及权限
- [x] 重置用户密码
- [x] 查询用户列表
- [x] 新增用户

表单模块：

- [x] 客户信息列表
- [x] 上传图片（缓存，确认添加时存入永久区）
- [x] 增加客户信息
- [x] 更新客户信息
- [x] 删除用户信息
- [x] 批量删除用户信息
- [x] 更新/批量更新用户信息
- [x] 导出所有Excel表

系统模块：

- [x] 获取web端标题
- [x] 获取所有标题设置
- [x] 设置标题设置

# 四、项目总结

各个功能模块实现的总结，此项目前端

移动端：vue2+vant

后台管理系统：vue2+antdv

后端：express

数据库：mysql

## 后台登录模块

### 1.登录

学习到的点：登录模块的功能在antdv和element-admin都把它抽离到了vuex状态管理中处理。抽离出去后，基本的状态管理都不需要再动Login组件，能很好的维护状态。

### 2.路由权限管理

主要管理权限路由的模块在store/modules下的`permission.js`，

权限管理逻辑:

- `router.js`：路由的初始化，此时挂载`constantRouterMap`静态路由部分
- `router-gruands.js`:路由网关，在路由跳转前获取用户的token，判断是否已登录
- 如果已登录，则检测用户登录时缓存的info信息中的role信息，把role列表触发`GenerateRoutes()`异步路由的生成。·
- `permission.js`主要逻辑:拿role中的permission列表和异步路由列表`asyncRouterMap`的meta信息中的permission列表比对，如果存在则将他管理进`addRouters`的state状态中。
- 处理完成后，返回到网关层，将生成的addRoute列表，通过`router.addRoutes`插入到路由再放行，实现权限路由。



## 后台客户信息管理模块

### table组件封装



### form组件封装



### 图片上传

服务端:

```javascript
// upload中间件

// 使用multer.js简单上传
// 只需要加个中间件处理即可
const multer = require('multer')
const { nanoid } = require('nanoid');
// 对上传文件进行中间处理
const storage = multer.diskStorage({
  // 存放的位置
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../cache/')
  },
  // 存储时的文件名称处理
  filename: (req, file, cb) => {
    let filename = nanoid();
    if (file.mimetype == 'image/png') {
      cb(null, filename + '.png');
    } else if (file.mimetype == 'image/jpeg') {
      cb(null, filename + '.jpg');
    }
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, //2MB
    files: 5
  },
  fileFilter: function (req, file, cb) {
    // 限制文件上传类型，仅可上传png/jpeg格式图片
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },

})

module.exports = upload;

// 使用
router.post('/upload', upload.single('file'), uploadFile)
```

客户端：

```js
// 创建multipart/form-data文件上传表单。
// 发送http请求

let data = new FormData();
data.append("file", file);
let config = {
headers: {
    //添加请求头
    "Content-Type": "multipart/form-data",
    },
};
// ====仅作示例=======
return new Promise((resolve, reject) => {
    //把 uploadUrl 换成自己的 上传路径
    this.$http.post("/customer/upload", data, config)
        .then((res) => {
            if (res.status === "success") {
                resolve(res.url);
            } else {
                this.$toast.fail(res.message);
                reject(res.message);
            }
    	})
    });
});
```



### 图片压缩

图片压缩方式：

- 固定尺寸压缩

  `context.drawImage()`将图片文件写入到固定尺寸的canvas画布，

  再用canvas的API`canvas.toDataURL('image/jpeg')`输出图片的DataURL（base64字符串），

  再将Base64转成二进制文件流（实现思路：分割开格式区域和数据区域，数据区域使用`atob`和`charCodeAt`获取到Unicode 文件编码格式的文件数据，装入`Uint8Array`类中，再将此类传入`File类`）

- 保持比例压缩

  增加一步，先以图片`Image`类，装载图片，获取图片的真实宽高数据，记录比例，然后动态计算宽高。再以固定尺寸输入到canvas画布中，再导出。实现保持纵横比的图片输出。

```javascript
// 参考代码
// 1.图片加载,获取属性

// 2.画布载入图片，输出图片的DataURL

// 3.DataURL转File

```



## 拓展

```js
// 1.什么是DataURL，它的作用是什么？

// 2.什么是Base64,它可以表示什么？

// 3.什么是Bolb流

// 4.bolb怎么使用？

// 5.File类是什么?

// 6.File类怎么使用？

// 7.什么场景下使用Bolb什么场景下使用File类？

// 8.File类和Bolb类可以互转吗？

// 9.File类和Bolb类以及DataURL类如何进行互转？

// 10.什么是ArrayBuffer？

// 11.什么情况下会使用ArrayBuffer?

// 12.ArrayBuffer可以转换成File类和Bolb类吗？

// 13.ES6中有提供ArrayBuffer相关的新API有了解吗？他们简化什么场景？

```







### excel表格导出

使用`exceljs`这个工具类来实现excel表的写出功能。

基本用法

```javascript
// 1.创建workbook
const workbook = new ExcelJS.Workbook();
// 2.创建工作表
const worksheet = workbook.addWorksheet('信息报表');
// worksheet可以配置对应属性
worksheet.properties.defaultRowHeight = 80; //默认行高

// 3.设置列
worksheet.columns = [
    { header: '序号', key: 'id', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '微信名称', key: 'wx_name', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
  ];

// 4.插入行数据
// 伪代码
const row = [index + 1, wx_name, name, phone, address, id_card_number, '', '', remark, create_time, modified_time]
worksheet.addRow(row);

// 5.插入图片
const image = workbook.addImage({
    filename,
    extension
});
// 范围 tl表示左上角点 br表示右上角点
worksheet.addImage(image, {
    //设置显示的范围
    tl: { col: col, row: row }, //tl起点
    br: { col: col + 1, row: row + 1 },// br终点 
    editAs: 'undefined' //显示模式，跟随单元格缩放
});

```

感受：

实现学习成本低，但是不是特别灵活，很多样式都需要使用内置样式，但是图片的插入使用起来比较简单。

如果要灵活可以使用`xlsxjs`来替代实现。



## 部署

### env环境变量配置

### nginx配置



## 测试

### 压力测试

使用JMeter进行压力测试，但是由于JMeter自身是需要开端口模拟线程的，有线程限制，所以压测出现一些工具报错，就放弃了，但是基本上压力测试不会有服务端错误报出。

















