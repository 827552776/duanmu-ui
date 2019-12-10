import axios from '../axios'

// 分页查询生产过程中部件信息
export const findPage = (data) => {
    return axios({
        url: '/parts/findPage',
        method: 'post',
        data
    })
}
// 分页查询质检环节部件信息
export const findPageQc = (data) => {
    return axios({
        url: '/parts/findPageQc',
        method: 'post',
        data
    })
}
// 分页查询生产采购部件信息
export const findPagePr = (data) => {
    return axios({
        url: '/parts/findPagePr',
        method: 'post',
        data
    })
}
//保存工艺流程
export const saveCraft = (data) => {
    return axios({
        url: '/parts/saveCraft',
        method: 'post',
        data
    })
}
//查询工艺流程
export const queryTags = (data) => {
    return axios({
        url: '/parts/queryCraft',
        method: 'post',
        data
    })
}

//查询部件信息
export const queryParts = (data) => {
    return axios({
        url: '/parts/queryParts',
        method: 'post',
        data
    })
}

//更改部件生产状态
export const updateStsB = (data) => {
    return axios({
        url: '/parts/updateStsB',
        method: 'post',
        data
    })
}

//更改部件生产状态
export const updateStsA = (data) => {
    return axios({
        url: '/parts/updateStsA',
        method: 'post',
        data
    })
}

//更改部件生产状态
export const updateStsC = (data) => {
    return axios({
        url: '/parts/updateStsC',
        method: 'post',
        data
    })
}
//更改部件生产状态
export const fixRetrn = (data) => {
    return axios({
        url: '/parts/fixRetrn',
        method: 'post',
        data
    })
}
//更改部件生产状态
export const fix = (data) => {
    return axios({
        url: '/parts/fix',
        method: 'post',
        data
    })
}

//删除已拆部件
export const deleteParts = (data) => {
    return axios({
        url: '/parts/deleteParts',
        method: 'post',
        data
    })
}