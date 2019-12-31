import axios from '../axios'
//保存 订单（锻造）
export const save = (data) => {
    return axios({
        url: '/order/save',
        method: 'post',
        data
    })
}
//保存 订单（铸造）
export const save1 = (data) => {
    return axios({
        url: '/order/save1',
        method: 'post',
        data
    })
}
//保存 运费
export const saveFare = (data) => {
    return axios({
        url: '/fare/save',
        method: 'post',
        data
    })
}
//查询 运费
export const queryFare = (data) => {
    return axios({
        url: '/fare/query',
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
//查询 派工单
export const queryDispa = (data) => {
    return axios({
        url: '/dispa/query',
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

// 分页查询全部（锻造）
export const findPage = (data) => {
    return axios({
        url: '/order/findPage',
        method: 'post',
        data
    })
}
// 分页查询全部（铸造）
export const findPage1 = (data) => {
    return axios({
        url: '/order/findPageZhu',
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
//获取ID
export const queryPrimaryKey = (data) => {
	    return axios({
	        url: '/order/queryPrimaryKey',
	        method: 'get'
	    })
}