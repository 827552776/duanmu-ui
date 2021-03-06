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
    url: '/material/find',
    method: 'post',
    data
  })
}
// 分页查询
export const findPageZI = (data) => {
  return axios({
    url: '/material/findZI',
    method: 'post',
    data
  })
}
// 分页查询
export const findPageAb = (data) => {
  return axios({
    url: '/material/findAb',
    method: 'post',
    data
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

export const queryTogeter = (data) => {
  return axios({
    url: '/material/queryTogeter',
    method: 'post',
    data
  })
}
