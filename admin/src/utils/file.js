export function download(href, title) {
  let link = document.createElement("a"); //创建a标签
  link.style.display = "none"; //使其隐藏
  link.href = href; //赋予文件下载地址
  link.setAttribute("download", title); //设置下载属性 以及文件名
  document.body.appendChild(link); //a标签插至页面中
  link.click(); //强制触发a标签事件
  document.body.removeChild(link);
}
