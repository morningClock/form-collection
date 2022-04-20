const express = require('express');

const app = express();

// 解决跨域问题
app.use(require('cors')())
// 可以返回json格式的数据给前端
app.use(express.json())

// 引入admin接口,传入express对象
require('./routes/admin')(app)
require('./routes/web')(app)

// 开放静态资源
app.use('/uploads', express.static(__dirname + '/uploads'))

app.listen(3000, () => {
  console.log('http://localhost:3000')
})