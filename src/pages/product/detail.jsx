import React, {Component} from 'react'
import {
    List,
    Card,
    message
} from 'antd'
import {
    ArrowLeftOutlined,
} from '@ant-design/icons'

import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constaints";
import {reqCategory} from '../../api'


const Item = List.Item

/*Product的产品详情子路由组件*/
export default class ProductDetail extends Component {
    state = {
        cName1: '', //一级分类名称
        cName2: '', //二级分类名称
    }
    getCname =async () => {
        const {pCategoryId, categoryId} = this.props.location.state.product
        let cName1='', cName2=''
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            cName1 = result.data.name

        } else {
            /*const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            cName1 = result1.data.name
            cName2 = result2.data.name*/
            //一次发多个请求,只有都成功了,才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            cName1 = results[0].data.name
            cName2 = results[1].data.name
        }
        this.setState({
            cName1,
            cName2
        })
    }
    componentDidMount() {

        this.getCname().then(r => {}).catch(e => {message.error('出错啦')})

    }

    render() {
        //读取携带过来的状态数据
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{marginRight: 10, fontSize: 15}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List
                    bordered
                >
                    <Item>
                        <span className="left">商品名称:</span>
                        {name}
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        {desc}
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        {price}元
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        {cName1} {cName2 ? '-->' + cName2 : ''}
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        className="product-img"
                                        alt="img"
                                    />
                                ))
                            }
                        </span>

                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}/>
                    </Item>
                </List>
            </Card>
        )
    }
}
