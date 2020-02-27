import axios from '../axios'
/*
* 入库管理
*/

// 保存
export const save = (data) => {
  return axios({
    url: '/access/save',
    method: 'post',
    data
  })
}
//确认
export const saveConfirm = (data) => {
  return axios({
    url: '/access/saveConfirm',
    method: 'post',
    data
  })
}
//确认
export const saveConfirmOut = (data) => {
  return axios({
    url: '/accessOut/saveConfirm',
    method: 'post',
    data
  })
}
// 删除saveConfirm
export const batchDelete = (data) => {
  return axios({
    url: '/access/delete',
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
export const findPageAb = (data) => {
  return axios({
    url: '/access/accessAb',
    method: 'post',
    data
  })
}
export const findPage1 = (data) => {
  return axios({
    url: '/access/access1',
    method: 'post',
    data
  })
}
//
// 分页查询
export const findPageOut = (data) => {
  return axios({
    url: '/accessOut/access',
    method: 'post',
    data
  })
}
