import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree,
} from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item

const treeData = [
    {
        title: '平台权限',
        key: 'all',
        children: null,
    }
]


//添加分类的form组件
export default class AuthForm extends PureComponent {

    static propTypes = {
        role: PropTypes.object.isRequired
    }


    onCheck = checkedKeys => {

        this.setState({checkedKeys})
    }

    getMenus = () => this.state.checkedKeys


    /*shouldComponentUpdate(nextProps,nextState) {
        const curChecked = this.state.checkedKeys
        const nextChecked = nextProps.role.menus
        if (curChecked !== nextChecked){
            this.setState(state => ({
                checkedKeys: nextChecked
            }))
        }
        if (this.state !== nextState) {
            return true
        }
        /!*if (curChecked !== nextChecked) {
            this.setState({
                checkedKeys: nextChecked
            })
            return true
        }*!/
        return false
    }*/

    constructor(props) {
        super(props);

        treeData[0].children = menuList
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.role.menus !== prevProps.role.menus) {
            this.setState((state, props) => ({
                checkedKeys: this.props.role.menus
            }))
        }
    }


    render() {
        console.log('auth-form render()')
        const {role} = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 15},
        }
        return (
            <div>
                <Item
                    label="角色名称"
                    {...formItemLayout}
                >
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    treeData={treeData}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                />
            </div>
        )
    }
}



