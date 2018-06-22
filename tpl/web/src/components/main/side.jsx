/*
 * @Author: Mr.He 
 * @Date: 2018-06-11 13:33:06 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-06-11 14:36:27
 * @content: 
 */


import React, { Component } from "react";
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';


export default class MainSider extends Component {
    render() {
        return (
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
            >
                <div className="logo">货物系统</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Icon type="user" />
                        <span className="nav-text">
                            <Link to="/main">
                                卖单列表
                            </Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="video-camera" />
                        <span className="nav-text">
                            <Link to="/main/order">
                                买单列表
                            </Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="user" />
                        <span className="nav-text">
                            <Link to="/main/userassets">
                                用户资产管理
                            </Link>
                        </span>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}