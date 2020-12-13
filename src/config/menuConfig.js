const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'HomeOutlined',
        isPublic: true,//公开的
    },
    {
        title: '商品',
        key: '/products',
        icon: 'AppstoreOutlined',
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: 'BuildOutlined',
            },
            {
                title: '商品管理',
                key: '/product',
                icon: 'DesktopOutlined',
            },
        ],
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'UserOutlined',
    },
    {
        title: '角色管理',
        key: '/role',
        icon: 'SolutionOutlined',
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: 'AreaChartOutlined',
        children: [
            {
                title: '柱形图',
                key: '/bar',
                icon: 'BarChartOutlined',
            },
            {
                title: '线形图',
                key: '/line',
                icon: 'LineChartOutlined',
            },
            {
                title: '饼图',
                key: '/pie',
                icon: 'PieChartOutlined',
            },
        ],
    },
]

export default menuList
