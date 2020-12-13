import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd';



import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from '../home/home'
import Category from "../category/category";
import Product from "../product/product";
import User from "../user/user";
import Role from "../role/role";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";

const { Footer, Sider, Content } = Layout;

/*后台管理的路由组件*/
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存没有存储user==> 当前没有登录
        if (!user || !user._id) {
            //自动跳转到登录(在render()中)
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{margin: 20, backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/Category' component={Category}/>
                            <Route path='/Product' component={Product}/>
                            <Route path='/User' component={User}/>
                            <Route path='/Role' component={Role}/>
                            <Route path='/Bar' component={Bar}/>
                            <Route path='/Line' component={Line}/>
                            <Route path='/Pie' component={Pie}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器,可以获得最佳页面操作体验!</Footer>
                </Layout>
            </Layout>
        )
    }
}
