import axios from '../axios'

/*
 * 字典管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/customer/save',
        method: 'post',
        data
    })
}
// 删除
// 删除 订单
export const deleteCustomer = (data) => {
    return axios({
        url: '/customer/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/customer/findPage',
        method: 'post',
        data
    })
}
// 不带分页 查询
export const query = (data) => {
    return axios({
        url: '/customer/query',
        method: 'post',
        data
    })
}
