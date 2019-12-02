import axios from '../axios'

// 保存预估成本费用
export const save = (data) => {
    return axios({
        url: '/check/save',
        method: 'post',
        data
    })
}

// 保存拆单信息
export const saveSplit = (data) => {
    return axios({
        url: '/parts/save',
        method: 'post',
        data
    })
}