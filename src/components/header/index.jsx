import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';


import './index.less'
import {getTime} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from "../../api";
import menuList from '../../config/menuConfig'
import LinkButton from "../link-button";

class Header extends Component {

    state = {
        currentTime: getTime(Date.now()),
        city: '',
        weather: '',
    }
    getCurTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = getTime(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    getWeather = async () => {
        const {city, weather} = await reqWeather('Sydney')

        this.setState({city, weather})
    }

    //得到当前需要显示的title
    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        let title = ''
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].key === path) {
                title = menuList[i].title
                return title
            } else if (menuList[i].children) {
                // const cItem = menuList[i].children.find(cItem => cItem.key === path)
                const cItem = menuList[i].children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    title = cItem.title
                    return title
                }
            }
        }
        // menuList.forEach(item => {
        //     if (item.key === path) { //如果当前item对象的key与path一样,item的的title 就是需要显式的title
        //         title = item.title
        //     } else if (item.children) {
        //         const cItem = item.children.find(cItem => cItem.key === path)
        //         if (cItem) {
        //             title = cItem.title
        //         }
        //     }
        // })
        // return title
    }

    //第一次render()之后执行一次
    // 一般在此执行异步操作:发ajax请求/启动定时器
    componentDidMount() {
        this.getCurTime()
        //获取当前天气
        this.getWeather()
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    //退出登录
    logout = () => {
        //显示确认框
        Modal.confirm({
            title: '退出当前用户',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗?',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}

                this.props.history.replace('/login')
            }
        })
    }



    render() {
        const {currentTime, city, weather} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>{city}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
