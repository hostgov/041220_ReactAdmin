import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select,
} from 'antd'

const Item = Form.Item
const Option = Select.Option


//添加用户/修改用户的form组件
export default class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    formRef = React.createRef();

    onFinish = (values) => {
        console.log('Success:', values);
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }
    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.formRef.current.resetFields()
        }
    }

    render() {
        console.log('userform.render()')
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: {span: 15},
        }
        const {roles, user} = this.props
        return (
            <Form
                ref={this.formRef}
                onFinish={this.onFinish}
                {...formItemLayout}
            >
                <Item
                    name="username"
                    label="用户名"
                    initialValue ={user.username}
                    rules={[
                        {required: true, message: '用户名必须输入'},
                        {whitespace: true},
                    ]}
                >
                    <Input value={user.username} placeholder='请输入用户名'/>
                </Item>
                {
                    user._id ? null : (
                        <Item
                            name="password"
                            label="密码"
                            initialValue={user.password}
                            rules={[
                                {required: true, message: '密码必须输入'},
                                {whitespace: true},
                            ]}
                        >
                            <Input type='password' placeholder='请输入密码'/>
                        </Item>
                    )
                }

                <Item
                    name="phone"
                    label="手机号"
                    initialValue={user.phone}
                >
                    <Input placeholder='请输入手机号'/>
                </Item>
                <Item
                    name="email"
                    label="邮箱"
                    initialValue={user.email}
                >
                    <Input placeholder='请输入邮箱'/>
                </Item>

                <Item
                    name="role_id"
                    label="角色"
                    rules={[
                        {required: true, message: '角色必须选择'},
                    ]}
                    initialValue={user.role_id}
                >
                    <Select placeholder='请选择用户角色'>
                        {
                            roles.map(role => <Option key = {role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}



