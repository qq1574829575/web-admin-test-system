import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export const html2pdf = (element) => {
  return new Promise((resolve) => {
    const w = element.clientWidth // 获取屏幕宽度
    const h = element.clientHeight // 获取屏幕高度
    const scale = 1
    // 一页pdf显示html页面生成的canvas高度;
    const canvas = document.createElement('canvas')
    canvas.width = w * scale
    canvas.height = h * scale
    canvas.style.width = w * scale + 'px'
    canvas.style.height = h * scale + 'px'
    canvas.getContext('2d').scale(scale, scale)
    const opt = {
      scale: scale, // 添加scale 参数
      canvas: canvas, // 自定义canvas
      logging: false,
      width: w, // canvas 宽度
      hieght: h, // canvas 高度
      useCORS: true // 开启跨域
    }
    html2canvas(element, opt)
      .then((canvas) => {
        var pdf = new JsPDF('p', 'mm', 'a4') // A4纸，纵向
        var ctx = canvas.getContext('2d')
        var a4w = 190
        var a4h = 274 // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
        var imgHeight = Math.floor((a4h * canvas.width) / a4w) // 按A4显示比例换算一页图像的像素高度
        var renderedHeight = 0

        while (renderedHeight < canvas.height) {
          var page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight) // 可能内容不足一页 //用getImageData剪裁指定区域，并画到前面创建的canvas对象中

          page
            .getContext('2d')
            .putImageData(
              ctx.getImageData(
                0,
                renderedHeight,
                canvas.width,
                Math.min(imgHeight, canvas.height - renderedHeight)
              ),
              0,
              0
            )
          pdf.addImage(
            page.toDataURL('image/jpeg', 1.0),
            'JPEG',
            10,
            10,
            a4w,
            Math.min(a4h, (a4w * page.height) / page.width)
          ) // 添加图像到页面，保留10mm边距
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) {
            pdf.addPage() // 如果后面还有内容，添加一个空页
          }
        }
        resolve(pdf.output('datauristring'))
        return pdf.output('save', 'file.pdf')
        // document.getElementById("iframe123").src = pdf.output("datauristring");
      })
      .catch(() => {
        resolve(false)
      })
  })
}
