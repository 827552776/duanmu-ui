import axios from '../axios'


//保存外协信息
export const saveHelp = (data) => {
    return axios({
        url: '/help/save',
        method: 'post',
        data
    })
}

//查询外协信息
export const queryHelp = (data) => {
    return axios({
        url: '/help/query',
        method: 'post',
        data
    })
}