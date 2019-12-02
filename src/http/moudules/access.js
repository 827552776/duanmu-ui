import axios from '../axios'
/*
* 入库管理
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
    url: '/dict/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/access/access',
    method: 'post',
    data
  })
}
