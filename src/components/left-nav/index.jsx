import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';
// import {
//     AppstoreOutlined,
//     PieChartOutlined,
//     DesktopOutlined,
//     HomeOutlined,
//     BuildOutlined,
//     UserOutlined,
//     SolutionOutlined,
//     AreaChartOutlined,
//     BarChartOutlined,
//     LineChartOutlined,
// } from '@ant-design/icons';
import * as Icon from '@ant-design/icons';


import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

/*左侧导航的组件*/
class LeftNav extends Component {

    getIcon = (iconName) => {
        return React.createElement(Icon[iconName])
    }

    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        /*
        1. 如果当前用户是admin,
        2. 如果当前item是公开的,
        3. 当前用户有此item的权限:key有没有在menus中
         */
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if(item.children){//4.如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    //根据menu的数据数组动态生成对应的标签数组
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={this.getIcon(item.icon)}>
                        <Link to={item.key}>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={this.getIcon(item.icon)} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
    }


    getMenuNodes_reduce = (menuList) => {
        //得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {

            //如果当前用户有item对应的权限,才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={this.getIcon(item.icon)}>
                            <Link to={item.key}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    const find = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    if (find) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={this.getIcon(item.icon)} title={item.title}>
                            {this.getMenuNodes_reduce(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }

    constructor(props) {
        super(props);
        this.menuNodes = this.getMenuNodes_reduce(menuList)
    }


    render() {
        //得到当前请求的路由路径
        let path = this.props.location.pathname

        if (path.indexOf('/product')===0) {//说明当前请求的是商品或商品的子路由组件
            path = '/product'
        }

        const openKey = this.openKey

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

/*
withRouter 高阶组件:
包装非路由组件,返回一个新的组件
新的组件向非路由组件传递三个属性:history/location/match
* */
export default withRouter(LeftNav)
