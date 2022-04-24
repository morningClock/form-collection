
const ExcelJS = require('exceljs')
const fs = require('fs')
const path = require('path')
const fsExtra = require('fs-extra')
const md5 = require('md5')

function saveAsExcel(results) {
  // 查询结果存储到excel
  // 创建excel对象
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  // 添加工作表
  const worksheet = workbook.addWorksheet('信息报表');
  worksheet.properties.defaultRowHeight = 80; //默认行高

  // 设置列
  worksheet.columns = [
    { header: '序号', key: 'id', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '微信名称', key: 'wx_name', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '姓名', key: 'name', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '电话.', key: 'phone', width: 20, outlineLevel: 1, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '身份证号码', key: 'IDCard', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '身份证正面图', key: 'IDCardImage1', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '身份证反面图', key: 'IDCardImage2', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '备注', key: 'remark', width: 50, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '创建时间', key: 'createTime', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'left' } } },
    { header: '更新时间', key: 'updateTime', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'left' } } }
  ];
  // 初始化表头样式
  worksheet.columns.forEach((item, index) => {
    let key = String.fromCharCode("A".charCodeAt() + index) + '1';
    worksheet.getCell(key).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ff5faee3' },
      bgColor: { argb: 'ffffffff' }
    }
    worksheet.getCell(key).font = {
      bold: true,
      color: { argb: 'ffffffff' }
    }
  })


  // 设置行
  results.forEach(async (data, index) => {
    const {
      wx_name,
      name,
      phone,
      id_card_number,
      id_card_img_front,
      id_card_img_back,
      remark,
      create_time,
      modified_time
    } = data;
    const row = [index + 1, wx_name, name, phone, id_card_number, '', '', remark, create_time, modified_time]
    worksheet.addRow(row);

    // 设置图片
    await addImage({
      workbook,
      worksheet,
      imagePath: id_card_img_front,
      row: index + 1,
      col: 5
    });
    await addImage({
      workbook,
      worksheet,
      imagePath: id_card_img_back,
      row: index + 1,
      col: 6
    });
  })

  // 导出为文件
  return new Promise((resolve, reject) => {
    const pathname = path.resolve(__dirname, "../export")
    fsExtra.ensureDir(pathname).then(() => {
      // fileName根据database查询结果进行md5校验比对，md5一致时，不再重新生成新的文件
      var fileflag = md5(JSON.stringify(results));
      const filename = `${fileflag}.xlsx`
      let outputPath = `${pathname}/${filename}`;
      fs.access(filename, fs.constants.F_OK, async (err) => {
        if (err) {
          let writerStream = fs.createWriteStream(outputPath);
          await workbook.xlsx.write(writerStream);
        }
        resolve(`/export/${filename}`);
      })
    })
  })

}


async function addImage({ workbook, worksheet, imagePath, row, col }) {
  // 通过文件名将图像添加到工作簿
  let fileType = imagePath.split('.').pop();
  let extension = 'jpeg';
  if (fileType === 'jpg') {
    extension = 'jpeg';
  } else if (fileType === 'png') {
    extension = 'png';
  }
  let filename = path.resolve(__dirname, ".." + imagePath)

  return new Promise((resolve, reject) => {
    fs.access(filename, fs.constants.F_OK, (err) => {
      if (err) {
        reject("文件不存在:" + err);
      }
      const image = workbook.addImage({
        filename,
        extension
      });
      // 范围 tl表示左上角点 br表示右上角点
      worksheet.addImage(image, {
        tl: { col: col, row: row },
        br: { col: col + 1, row: row + 1 },
        editAs: 'undefined'
      });
      resolve()
    })
  })


}

module.exports = {
  saveAsExcel
}