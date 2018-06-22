/*
 * @Author: Mr.He 
 * @Date: 2018-06-04 17:29:29 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-06-11 11:37:53
 * @content: 
 */

import React, { Component } from "react";
import particlesConfig from "./particles.json";
import "./index.css";
import "particles.js";
import axios from "axios";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;


export default class Login extends Component {
    constructor() {
        super();

        this.state = {
            box: {
                height: window["innerHeight"],
                width: window["innerWidth"],
            },
            username: "",
            password: ""
        }
    }

    componentWillMount() {
        let token = sessionStorage.getItem("token");
        if (token) {
            location.hash = "/main";
        }
    }

    componentDidMount() {
        window.particlesJS("backBox", particlesConfig);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { username, password } = this.state;
        if (username == "tap4fun" && password == "tik.com") {
            sessionStorage.setItem("token", username + password);
            location.hash = "/main";
        } else {
            return alert("username and password not match.");
        }

        // axios({
        //     url: BACK_SYSTEM_URL + "/open/login",
        //     method: "post",
        //     data: {
        //         mobile: this.state.username,
        //         password: this.state.password
        //     }
        // }).then((resp) => {
        //     let result = resp.data;
        //     if (result.code != 0) {
        //         alert(result.msg);
        //         return console.error(result);
        //     }

        //     sessionStorage.setItem("token", result.data.token);
        //     location.hash = "/main";
        // }).catch((err) => {
        //     console.log(err);
        //     alert("Error: " + err.message);
        // })
    }
    onChangeUserName = (e) => {
        this.state.username = e.target.value;
    }
    onChangePassword = (e) => {
        this.state.password = e.target.value;
    }
    render() {
        window.onresize = () => {
            this.setState({
                box: {
                    height: window["innerHeight"],
                    width: window["innerWidth"],
                }
            })
        }
        return (
            <div>
                <div id="backBox" style={this.state.box}></div>
                <section className="login-box">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            <Input onChange={this.onChangeUserName} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        </FormItem>
                        <FormItem>
                            <Input onChange={this.onChangePassword} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </FormItem>
                    </Form>
                </section>
            </div>
        );
    }
}