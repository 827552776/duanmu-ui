import axios from '../axios'

/*
* 字典管理模块
*/

// 保存
export const save = (data) => {
  return axios({
    url: '/accessMaterial/save',
    method: 'post',
    data
  })
}
//确认
export const saveConfirm = (data) => {
  return axios({
    url: '/accessMaterial/saveConfirm',
    method: 'post',
    data
  })
}
//确认
export const saveConfirmInt = (data) => {
  return axios({
    url: '/accessMaterial/saveConfirmInt',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/accessMaterial/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/accessMaterial/find',
    method: 'post',
    data
  })
}
// 分页查询
export const findPageA = (data) => {
  return axios({
    url: '/accessMaterial/findA',
    method: 'post',
    data
  })
}

