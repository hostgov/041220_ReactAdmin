import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item

const Option = Select.Option

//添加分类的form组件
export default class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
    }

    formRef = React.createRef();

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
        if (nextProps.parentId !== this.props.parentId) {
            this.formRef.current.setFieldsValue({
                parentId: nextProps.parentId
            })
            return true
        }
        return false
    }


    render() {
        const {categorys, parentId = 0} = this.props
        return (

            <Form
                ref={this.formRef}
            >
                <Item
                    name='parentId'
                    initialValue={parentId}
                    label="父分类名称"
                    rules={[
                        {
                            required: true,
                        }
                    ]}
                >
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c => <Option value={c._id} key = {c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item
                    name="categoryName"
                    label="新分类名称"
                    initialValue=''
                    rules={[
                        {
                            required: true, message: '分类名称必须输入'
                        }
                    ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
            </Form>
        )
    }
}


