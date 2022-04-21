const multer = require('multer')
const { nanoid } = require('nanoid')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../cache/')
  },
  filename: (req, file, cb) => {
    if (file.mimetype == 'image/png') {
      cb(null, nanoid() + '.png');
    } else if (file.mimetype == 'image/jpeg') {
      cb(null, nanoid() + '.jpg');
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