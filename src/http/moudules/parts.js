import axios from '../axios'

// 分页查询工艺编制部件信息
export const findPage = (data) => {
    return axios({
        url: '/parts/findPage',
        method: 'post',
        data
    })
}
// 分页查询生产过程中部件信息
export const findPage1 = (data) => {
    return axios({
        url: '/parts/findPage1',
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
// 分页查询车间领料部件信息
export const findPagePi = (data) => {
    return axios({
        url: '/parts/findPagePi',
        method: 'post',
        data
    })
}
// 分页查询生产采购部件信息
export const findPagePp = (data) => {
    return axios({
        url: '/parts/findPagePp',
        method: 'post',
        data
    })
}
//分页查询合格品部件信息
export const findPageD = (data) => {
    return axios({
        url: '/parts/findPageD',
        method: 'post',
        data
    })
}
//分页查询可以打印成本核算的订单
export const findPageDcost = (data) => {
    return axios({
        url: '/parts/findPageDcost',
        method: 'post',
        data
    })
}
//分页查询不合格品部件信息
export const findPageDn = (data) => {
    return axios({
        url: '/parts/findPageDn',
        method: 'post',
        data
    })
}
//修改工艺流程
export const saveCraft = (data) => {
    return axios({
        url: '/parts/saveCraft',
        method: 'post',
        data
    })
}
//保存工艺流程
export const saveCraftbefor = (data) => {
    return axios({
        url: '/parts/saveCraftbefor',
        method: 'post',
        data
    })
}
//保存临时采购计划
export const savePurch = (data) => {
    return axios({
        url: '/parts/savePurch',
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

//更改部件生产状态,进入质检环节
export const updateStsC = (data) => {
    return axios({
        url: '/parts/updateStsC',
        method: 'post',
        data
    })
}
//已领料
export const updatePick = (data) => {
    return axios({
        url: '/parts/updatePick',
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
export const updateStsD = (data) => {
    return axios({
        url: '/parts/updateStsD',
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

//模具外购标件
export const queryTogeter = (data) => {
    return axios({
        url: '/parts/queryTogeter',
        method: 'post',
        data
    })
}