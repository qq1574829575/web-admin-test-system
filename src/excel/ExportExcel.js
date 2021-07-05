// json化
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
// 导出表格方法
export default function exportExcel(tableHeaher, prop, tableData, tableName) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('./Export2Excel')
    const tHeader = tableHeaher // 上面设置Excel的表格第一行的标题
    // 上面的index、nickName、name是tableData里对象的属性
    // 把data里的tableData存到list
    const data = formatJson(prop, tableData)
    // const merges = ['A1:E1'] 合并单元格
    const merges = []
    export_json_to_excel(tHeader, data, tableName, merges) // 标题，数据，文件名
  })
}
