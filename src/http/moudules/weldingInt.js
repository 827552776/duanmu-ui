import axios from '../axios'

/*
* 字典管理模块
*/

// 保存
export const save = (data) => {
  return axios({
    url: '/weldingIn/save',
    method: 'post',
    data
  })
}
//确认
export const saveConfirm = (data) => {
  return axios({
    url: '/weldingIn/saveConfirm',
    method: 'post',
    data
  })
}
//确认
export const saveConfirmInt = (data) => {
  return axios({
    url: '/weldingIn/saveConfirmInt',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/weldingIn/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/weldingIn/find',
    method: 'post',
    data
  })
}
export const findPage1 = (data) => {
  return axios({
    url: '/weldingIn/findR',
    method: 'post',
    data
  })
}
// 分页查询
export const findPageA = (data) => {
  return axios({
    url: '/weldingIn/findA',
    method: 'post',
    data
  })
}

