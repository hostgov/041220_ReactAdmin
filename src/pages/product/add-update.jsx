import React, {Component} from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'
import {
    ArrowLeftOutlined
} from '@ant-design/icons'

import LinkButton from "../../components/link-button";
import {reqAddOrUpdateProduct, reqGetCategorys} from "../../api";
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input

/*Product的添加和更新的子路由组件*/
export default class ProductAddUpdate extends Component {
    state = {
        options: [],
    }
    formRef = React.createRef()
    pictureRef = React.createRef()
    editorRef = React.createRef()



    initOptions =async (categorys) => {
        //根据categorys生成options数组
        const options =categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联到对应的一级option上
            targetOption.children = childOptions
        }

        //更新options状态
        this.setOptions(options)
    }
    //异步获取一级/或二级分类列表
    //async函数的返回值是一个新的promise对象,promise的结果和值由async的结果来决定
    getCategorys =async (parentId) => {
        const result = await reqGetCategorys(parentId)
        if (result.status ===0) {
            const categorys = result.data

            if (parentId === '0') { //获取的是一级分类列表
                await this.initOptions(categorys)
            } else { //获取的是二级分类列表
                return categorys //返回二级列表 ==>当前async函数返回的promise就会成功且,value为categorys
            }
        }
    }


    //验证价格的自定义验证函数
    validatePrice = (rule, value) => {
        if (value * 1 > 0) {
            return Promise.resolve()
        } else {
            return Promise.reject('价格必须大于0')
        }
    }

    //v4 onfinish 仅当校验通过是才会触发
    onFinish = async values => {
        // console.log(values)
        //1 收集数据

        const imgs = this.pictureRef.current.getImgs()
        const detail = this.editorRef.current.getDetail()
        // console.log('imgs ========', imgs, detail)
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const product = {
            name, desc, price, imgs, detail, pCategoryId, categoryId
        }
        //如果是更新,需要添加_id
        if (this.isUpdate) {
            product._id = this.product._id
        }
        //2.调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)
        //3.根据结果提示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
    }



    loadData =async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true

        //根据选中的分类,请求获取二级分类列表
        const subCategorys =await this.getCategorys(targetOption.value)

        targetOption.loading = false
        if (subCategorys && subCategorys.length>0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
        } else {//当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

        this.setOptions([...this.state.options])
    }
    setOptions = ([...options]) => {
        this.setState({
            options: [...options]
        })
    }

    constructor(props) {
        super(props);
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
        //创建用来保存ref表示的标签对象的容器

    }


    componentDidMount() {
        this.getCategorys('0')
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail } = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        //指定Item布局的配置对象
        const layout = {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 8,
            },
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{fontSize: 20, marginRight: 10}}/>
                </LinkButton>
                <span>添加商品</span>
            </span>
        )


        return (
            <Card title={title}>
                <Form
                    {...layout}
                    ref={this.formRef}
                    onFinish={this.onFinish}
                >
                    <Item
                        name='name'
                        label='商品名称'
                        initialValue={product.name}
                        rules={[{required: true, message: '必须输入商品名称'}]}
                    >
                        <Input placeholder='请输入商品名称'/>
                    </Item>
                    <Item name='desc' initialValue={product.desc} label='商品描述' rules={[{required: true, message: '必须输入商品描述'}]}>
                        <TextArea placeholder='请输入商品描述' autosize={{minRows: 2, maxRows: 6}}/>
                    </Item>
                    <Item
                        name='price'
                        initialValue={product.price}
                        label='商品价格'
                        rules={[
                            {required: true, message: '必须输入商品价格'},
                            {validator: this.validatePrice}
                        ]}
                    >
                        <Input
                            placeholder='请输入商品价格'
                            type='number'
                            maxLength={10}
                            min={1}
                            max={999999999}
                            addonBefore='￥'
                            addonAfter='元'
                        />
                    </Item>
                    <Item name='categoryIds' initialValue={categoryIds} label='商品详情' rules={[{required: true, message: '必须输入商品分类'}]}>
                        <Cascader
                            placeholder='请选择商品分类'
                            options={this.state.options}
                            loadData={this.loadData}
                            // onChange-{}
                            changeOnSelect={false}
                        >

                        </Cascader>
                    </Item>

                    <Item
                        name='imgs'
                        label='商品图片'
                    >
                        <PicturesWall ref={this.pictureRef} imgs={imgs}/>
                    </Item>
                    <Item name='detail' label='商品详情' labelCol= {{span: 2,}} wrapperCol= {{span: 20,}}>
                        <RichTextEditor ref={this.editorRef} detail={detail}/>
                    </Item>

                    <Item name='up'>
                        <Button type='primary' htmlType='submit'>提交</Button>
                    </Item>
                </Form>

            </Card>
        )
    }
}
