/*
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from './ajax'


const BASE = ''

//登录
// export function reqLogin(username, password) {
//     return ajax('/login', {username, password}, 'POST')
// }
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

//添加/修改用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//获取一级/二级分类列表
export const reqGetCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
//更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

//搜索商品分页列表(根据商品名称/商品描述搜索) searchType: 搜索的类型, productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
})

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

//更新商品的状态(上架/下架)
export const reqUpdataStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

//删除指定的商品图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id? 'update': 'add'), product,'POST')
//修改商品
//export const reqAddUpdate = (product) => ajax(BASE + '/manage/product/update',product,'POST')
//获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
//更新角色权限
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
//获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
//删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete',{userId}, 'POST')


//jsonp请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise ((resolve, reject) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8a5b2cc4d6390158e1f104ba8ff035f3&lang=zh_cn`
        jsonp(url, {}, (err, data) => {
            if (!err && data.cod === 200) {
                const r_data = {
                    city: '',
                    weather: ''
                }
                r_data.city = data.name
                r_data.weather = data.weather[0].description
                resolve(r_data)
            } else {
                message.error('获取天气信息失败')
            }
        })
    })

}
// reqWeather('Sydney')
