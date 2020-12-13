import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Button, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import StorageUtils from "../../utils/storageUtils";

/*登录的路由组件*/
export default class Login extends Component {
    formRef = React.createRef()
    onFinish = async (values) => {
        //console.log('Received values of form: ', values);
        //请求登录
        const {username, password} = values

        const result = await reqLogin(username, password)
        // console.log('请求成功', response.data)
        // const result = response.data //
        if (result.status === 0) {
            //登录成功
            message.success('登录成功')
            //保存user
            const user = result.data
            memoryUtils.user = user //保存在内存中
            StorageUtils.saveUser(user) //保存到local中
            //route到管理界面
            this.props.history.replace('/')
        } else {
            //登录失败
            message.error(result.msg)
        }
    }
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }

    validatePwd = (rule, value, callback) => {

        return new Promise(async (resolve, reject) => {
            if (!value) {
                await reject('密码必须输入')
            } else if (value.length < 4) {
                await reject('密码长度不能小于4位')
            } else if (value.length > 12) {
                await reject('密码长度不能大于于12位')
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                await reject('密码必须是英文、数字或下划线组成')
            } else {
                await resolve()
            }
        })
    }

    render() {
        //如果用户已经登录,自动跳转到管理界面
        const user = memoryUtils.user;
        if (user._id) {
            return <Redirect to='/'/>
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {required: true, whitespace: true, message: 'Please input your Username!'},
                                {min: 4, message: '用户名至少4位'},
                                {max: 12, message: '用户名最多12位'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文,数字或下划线组成'}
                            ]}
                            initialValue='admin'
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"
                                                         style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator: this.validatePwd
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"
                                                      style={{color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder="password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                LOG IN
                            </Button>
                            {/*Or <a href="">register now!</a>*/}
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }

}



