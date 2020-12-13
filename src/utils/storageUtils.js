/*进行local数据存储管理的工具模块*/

const USER_KEY = 'user_key'

const StorageUtils = {
    //保存user
    saveUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    //读取user
    getUser() {
        return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    },
    //删除user
    removeUser(user) {
        localStorage.removeItem(USER_KEY)
    }
}
export default StorageUtils
