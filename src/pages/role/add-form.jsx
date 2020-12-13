import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
} from 'antd'

const Item = Form.Item


//添加分类的form组件
export default class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
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

    render() {
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: {span: 15},
        }
        return (
            <Form
                ref={this.formRef}
                onFinish={this.onFinish}
            >
                <Item
                    name="roleName"
                    label="角色名称"
                    {...formItemLayout}
                    initialValue=''
                    rules={[
                        {required: true, message: '角色名称必须输入'},
                        {whitespace: true},
                        {validateTrigger: ''}
                    ]}
                >
                    <Input placeholder='请输入角色名称'/>
                </Item>
            </Form>
        )
    }
}



