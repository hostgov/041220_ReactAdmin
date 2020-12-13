import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import {PAGE_SIZE} from "../../utils/constaints"
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api"
import AddForm from "./add-form";
import AuthForm from "./auth-form"
import memoryUtils from "../../utils/memoryUtils";
import {getTime} from '../../utils/dateUtils'
import storageUtils from "../../utils/storageUtils"


/*角色路由*/
export default class Role extends Component {

    state = {
        roles: [], //所有角色的列表
        role: {}, //选中的role
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false, //是否显示设置角色权限界面
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',

            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => getTime(create_time)

            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: getTime
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',

            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    constructor(props) {
        super(props)
        this.initColumn()
        this.authRef = React.createRef()
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }

    //添加角色
    addRole = () => {
        //进行表单验证,通过了才能继续
        this.form.validateFields().then(async values => {
            //隐藏确认框
            this.setState({
                isShowAdd: false
            })
            //收集输入数据
            const {roleName} = values
            this.form.resetFields()
            //发请求添加
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                //根据结果提示或更新显示
                message.success('添加角色成功!')
                const role = result.data
                //更新roles状态
                /*const roles = [...this.state.roles] //对象数组用浅拷贝方式才能更新对象地址
                roles.push(role)
                this.setState({
                    roles
                })*/
                //状态更新roles:基于原本的状态数据更新
                this.setState(state => ({
                    roles: [...state.roles, role]
                }))

            } else {
                message.error('添加角色失败!')
            }
        }).catch()

    }

    //设置角色权限
    updateRole = async () => {
        this.setState({isShowAuth: false})
        const role = this.state.role
        const menus = this.authRef.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {

            //如果当前更新的是自己角色的权限,强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了,请重新登录!')
            } else {
                message.success('设置用户角色权限成功!')
                // this.getRoles()
                this.setState({
                    roles: [...this.state.roles]
                })
            }

        } else {
            message.error('设置用户角色权限失败!')
        }
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state


        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id}
                        onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false
                        })
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false
                        })
                    }}
                >
                    <AuthForm ref={this.authRef} role={role}/>
                </Modal>
            </Card>
        )
    }
}
