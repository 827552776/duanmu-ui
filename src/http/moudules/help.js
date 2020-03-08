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

//模具和模具外协联合查询
export const queryTogeter = (data) => {
    return axios({
        url: '/help/queryTogeter',
        method: 'post',
        data
    })
}