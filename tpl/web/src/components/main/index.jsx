/*
 * @Author: Mr.He 
 * @Date: 2018-06-11 10:28:50 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-06-11 14:35:36
 * @content: 
 */

import React, { Component } from "react";
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;
import Trade from "../trade/index.jsx";
import Order from "../order/index.jsx";
import MainSider from "./side.jsx";
import UserAssets from "../userAssets/index.jsx";

export default class Main extends Component {
    constructor() {
        super();

    }

    state = {
        contentStyle: {
            padding: 24, background: '#fff', minHeight: window.innerHeight - 34
        }
    }

    componentWillMount() {
        let token = sessionStorage.getItem("token");
        if (!token) {
            location.hash = "/";
        }
    }

    render() {
        window.onresize = () => {
            this.setState({
                contentStyle: {
                    padding: 24, background: '#fff', minHeight: window.innerHeight - 34
                }
            })
        }

        return (
            <Router>
                <Layout>
                    <MainSider />
                    <Layout>
                        <Content style={{ margin: '24px 16px 10px' }}>
                            <div style={this.state.contentStyle}>
                                <Route exact path="/main" component={Trade} />
                                <Route path="/main/order" component={Order} />
                                <Route path="/main/userassets" component={UserAssets} />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
        );
    }
}