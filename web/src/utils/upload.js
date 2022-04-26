/**
 * 压缩图片
 */
export function compressImage(imgFile, compressWidth) {
  return new Promise((resolve) => {
    let image = new Image()
    image.src = imgFile.content; //base64
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const ratio = image.height / image.width; //原图比例
      if (image.width < compressWidth) {
        // 原图宽度小于设定宽度，不增加宽度
        compressWidth = image.width;
      }
      const imageWidth = compressWidth;
      const imageHeight = compressWidth * ratio;
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      context.drawImage(image, 0, 0, imageWidth, imageHeight);
      // 压缩后的base64
      const data = canvas.toDataURL('image/jpeg')
      let file = base64ToFile(data, imgFile.file.name)
      resolve(file);
    }
  })
}

/**
 * base64转file    
 * base64格式：data:image/png;base64,iVBORw0KGgoAAAANSU...
 * @param {*} dataURL base64编码数据
 * @param {*} filename 文件名称
 */
function base64ToFile(dataURL, filename) {
  const arr = dataURL.split(','),
    mime = arr[0].match(/:(.*?);/)[1], //mime类型 image/png
    bstr = atob(arr[1]); //base64 解码

  let n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}