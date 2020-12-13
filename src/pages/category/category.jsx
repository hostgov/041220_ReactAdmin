import React, {Component} from 'react'
import {
    Card,
    Table,
    Button,
    message,
    Modal
    } from 'antd'
import {
    PlusOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons'


import LinkButton from "../../components/link-button";
import {reqGetCategorys, reqAddCategory, reqUpdateCategory} from '../../api'
import AddForm from "./add-form"
import UpdateForm from "./update-form";



/*品类路由*/
export default class Category extends Component {

    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //一级分类列表
        subCategorys: [], //子分类列表
        parentId: '0', //当前需要显示的分类列表的parentId
        parentName: '',//当前需要显示的分类列表的名称
        showStatus: 0, // 标识添加/更新的确认框是否显示,0:都不显示, 1: 显示添加, 2: 显示修改
    }

    //初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数:先定义一个匿名函数,在函数中调用处理的函数并传入数据*/}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

                    </span>
                )
            },
        ]
    }

    //异步获取一级/二级衱分类列表显示
    getCategorys = async (parentId) => {
        //在发请求前,显示loading
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqGetCategorys(parentId)
        this.setState({loading: false})
        //在请求完成后,隐藏loading
        if (result.status === 0) {

            //取出分类数组(可能是一级,也可能是二级的)
            const categorys = result.data
            //更新状态
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }

        } else {
            message.error('获取分类列表失败!')
        }
    }

    //显示 指定一级分类对象的二级分类子列表
    showSubCategorys = (category) => {
        //更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //setState的传的回调函数会在状态更新且重新render()后执行
            this.getCategorys()
        })
    }

    //显示 指定一级分类列表
    showCategorys = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        })
    }

    //响应点击取消,隐藏确认框
    handleCancel = () => {
        //清除输入数据
        this.formRef.current.resetFields()
        this.setState({
            showStatus: 0
        })
    }
    //显示添加确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    //显示修改确认框
    showUpdate = (category) => {
        // console.log(category)
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus: 2
        })
    }


    //添加分类
    addCategory = () => {
        const categoryName = this.formRef.current.getFieldValue('categoryName')
        if (categoryName.trim()) {
            this.formRef.current.validateFields()
                .then(async values => {
                    //隐藏确认框
                    this.setState({
                        showStatus: 0
                    })
                    const {categoryName, parentId} = values
                    //收集数据,并提交添加分类的请求
                    this.formRef.current.resetFields()
                    const result = await reqAddCategory(categoryName, parentId)
                    if (result.status===0) {
                        //添加的分类就是当前的分类列表下的分类
                        if (parentId === this.state.parentId) {
                            //重新获取分类列表显示
                            this.getCategorys()
                        } else if (parentId === '0') {//在二级分类列表下添加一级分类列表项,要重新获取一级分类列表,但不需要显示一级分类列表
                            this.getCategorys('0')
                        }
                    }
                })
                .catch(error => {
                    message.error(error)
                })
        }

    }
    //更新分类
    updateCategory = () => {
        //进行表单验证,只有通过了才处理
        const categoryName = this.formRef.current.getFieldValue('categoryName')
        if (categoryName.trim()) {
            this.formRef.current.validateFields()
                .then(async values => {
                    //隐藏修改列表确认框
                    this.setState({
                        showStatus: 0
                    })

                    const categoryId = this.category._id
                    const {categoryName} = values

                    //发请求更新分类
                    const result = await reqUpdateCategory({categoryId, categoryName})

                    if (result.status === 0) {
                        //重新显示列表
                        await this.getCategorys()
                    }
                })
                .catch(error => {
                    message.error(error)
                })
        }
    }


    //为第一次render()准备数据
    constructor(props) {
        super(props);
        this.initColumns()
    }

    //发异步ajax请求获取
    componentDidMount() {
        this.getCategorys()
    }

    render() {
        //读取状态数据
        const {categorys, subCategorys,parentName, parentId, loading, showStatus} = this.state
        //读取指定的分类
        const category = this.category || {}

        //card右侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
                添加
            </Button>
        )

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered={true}
                        rowKey='_id'
                        key='_id'
                        dataSource={parentId==='0'?categorys : subCategorys}
                        columns={this.columns}
                        loading={loading}
                        pagination={{
                            defaultPageSize: 5,
                            showQuickJumper: true,
                        }}
                    />
                    <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                    >
                        <AddForm categorys={categorys} parentId={parentId} setForm ={(formRef) => {this.formRef = formRef}}/>
                    </Modal>
                    <Modal
                        title="修改分类"
                        visible={showStatus === 2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                    >
                        <UpdateForm
                            categoryName={category.name || ''}
                            setForm ={(formRef) => {this.formRef = formRef}} />
                    </Modal>
                </Card>
            </div>
        )
    }
}
