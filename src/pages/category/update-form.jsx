import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
} from 'antd'

const Item = Form.Item

//添加分类的form组件
export default class UpdateForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    onFinish = (values) => {
        console.log('Success:', values);
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    componentDidMount() {
        this.props.setForm(this.formRef)
    }


    shouldComponentUpdate (nextProps) {
        //回显分类名称
        if (nextProps.categoryName !== this.props.categoryName) {
            this.formRef.current.setFieldsValue({
                categoryName: nextProps.categoryName
            })
            return true
        }
        return false
    }

    render() {
        // console.log('render()')
        const {categoryName} = this.props

        return (
            <Form
                ref={this.formRef}
            >
                <Item
                    name="categoryName"
                    label="分类名称"
                    initialValue={categoryName}
                    rules={[
                        {required: true, message: '分类名称必须输入'}
                    ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
            </Form>
        )
    }
}


