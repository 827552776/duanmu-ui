import axios from '../axios'

/*
* 字典管理模块
*/

// 保存
export const save = (data) => {
  return axios({
    url: '/material/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/material/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/MaterialZi/find',
    method: 'post',
    data
  })
}
// 分页查询
export const findPageAb = (data) => {
  return axios({
    url: '/MaterialZi/findAll',
    method: 'post',
    data
  })
}
//查询所有
export const findAll = () => {
  return axios({
    url: '/MaterialZi/findMaterial',
    method: 'get',
  })
}
// 导出Excel
export const exportExcel = (params) => {
  return axios({
    url: '/material/exportExcel',
    method: 'post',
    params
  })
}


