import axios from '../axios'

// 分页查询全部
export const findPage = (data) => {
    return axios({
        url: '/parts/findPage',
        method: 'post',
        data
    })
}

export const saveCraft = (data) => {
    return axios({
        url: '/parts/saveCraft',
        method: 'post',
        data
    })
}

export const queryTags = (data) => {
    return axios({
        url: '/parts/queryCraft',
        method: 'post',
        data
    })
}