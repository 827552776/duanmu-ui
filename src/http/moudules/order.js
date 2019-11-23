import axios from '../axios'

export const save = (data) => {
    return axios({
        url: '/order/save',
        method: 'post',
        data
    })
}

export const saveDispa = (data) => {
    return axios({
        url: '/dispa/save',
        method: 'post',
        data
    })
}