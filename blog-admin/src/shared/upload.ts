export const exportExcel = (data: any) => {
  const link = document.createElement('a')
  const blob = new Blob([data], { type: 'multipart/form-data' })
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', decodeURI(Date.now() + '导出模板.xlsx'))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportDownload = (data: any) => {
  const link = document.createElement('a')
  const blob = new Blob([data], { type: 'multipart/form-data' })
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', decodeURI(Date.now() + '下载模板.xlsx'))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
