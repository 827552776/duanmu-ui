import axios from '../axios'
//保存 订单
export const save = (data) => {
    return axios({
        url: '/order/save',
        method: 'post',
        data
    })
}

//保存 派工单
export const saveDispa = (data) => {
    return axios({
        url: '/dispa/save',
        method: 'post',
        data
    })
}
//把状态更改成B
export const updateSts = (data) => {
    return axios({
        url: '/order/updateSts',
        method: 'post',
        data
    })
}

//把状态更改成C
export const updateStsC = (data) => {
    return axios({
        url: '/order/updateStsC',
        method: 'post',
        data
    })
}

// 删除 订单
export const deleteOrd = (data) => {
    return axios({
        url: '/order/delete',
        method: 'post',
        data
    })
}

// 删除 派工单
export const deleteDispa = (data) => {
    return axios({
        url: '/dispa/delete',
        method: 'post',
        data
    })
}

// 分页查询全部
export const findPage = (data) => {
    return axios({
        url: '/order/findPage',
        method: 'post',
        data
    })
}

// 分页查询状态A和B
export const findPageAb = (data) => {
    return axios({
        url: '/order/findPageAb',
        method: 'post',
        data
    })
}