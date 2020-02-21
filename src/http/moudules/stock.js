import axios from '../axios'

/*
* 字典管理模块
*/

// 保存
export const save = (data) => {
  return axios({
    url: '/stock/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/stock/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/stock/stock',
    method: 'post',
    data
  })
}
export const findPageAb = (data) => {
  return axios({
    url: '/stock/stockAb',
    method: 'post',
    data
  })
}

