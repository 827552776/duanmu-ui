import axios from '../axios'
//保存 订单
export const save = (data) => {
    return axios({
        url: '/unqu/save',
        method: 'post',
        data
    })
}