import axios from '../axios'
//保存 不合格产品
export const save = (data) => {
    return axios({
        url: '/unqu/save',
        method: 'post',
        data
    })
}
//查询 不合格产品
export const query = (data) => {
    return axios({
        url: '/unqu/query',
        method: 'post',
        data
    })
}