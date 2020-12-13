import React, {Component} from 'react'
import {Button, Card, message, Modal, Table} from 'antd'

import {getTime} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index"
import {PAGE_SIZE} from "../../utils/constaints";
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api";
import UserForm from "./user-form";


/*用户路由*/
export default class User extends Component {
    state = {
        users: [], //初始用户列表
        roles: [], //所有角色列表
        isShow: false, //是否显示添加/修改模态框
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: getTime
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    //根据role的数组,生成包含所有角色名的对象(属性名用该角色id值)
    initRoleNames = (roles) => {
        //保存
        this.roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }
//删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                } else {
                    message.error('删除用户失败!')
                }
            }
        })
    }

    //显示修改页面
    showUpdate = (user) => {
        this.user = user
        this.setState({
            isShow: true
        })
    }
    //显示添加界面
    showAdd = () => {
        this.user = null
        this.setState({isShow: true})
    }

    //添加/更新用户
    addOrUpdateUser = async () => {
        this.setState({isShow: false})
        //0.验证数据

        //1.收集数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        if (this.user) {
            user._id = this.user._id
        }
        //2. 提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功!`)

            this.getUsers()
            //3. 更新列表显示
        } else {
            message.error('添加用户失败!')
        }


    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState(state => ({
            isShow: false
        }))

    }

    constructor(props) {
        super(props);

        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }


    render() {
        console.log('user.render()')
        const {users, isShow, roles} = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    key='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <UserForm
                        setForm={(form) => this.form = form}
                        roles = {roles}
                        user = {user}
                    />
                </Modal>
            </Card>
        )
    }
}
