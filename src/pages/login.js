import React from 'react';
import {Button, Carousel, Form, Input} from 'antd';
import cookie from 'react-cookies';
import axios from 'axios';
import '../asset/login.css'
import './config';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Checkbox from "antd/es/checkbox";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',//只提供邮箱登录
        }
        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    //检查邮箱
    checkEmail(rule, value, callback) {
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
            callback('请输入正确的邮箱地址');
        }
        callback();
    }

    //调用后端邮箱api
    submit() {
        //非登录状态传输数据的方式:使用formData
        let formData = new FormData();
        formData.append('password', this.state.password);
        formData.append('email', this.state.email);
        console.log(this.state.password)
        console.log(this.state.email)
        ////调用后端api,并存储返回值
        axios.post(global.constants.url +'/api/login' , formData)
            .then((res)=>{
                let ret = res.data;
                let state = ret.state;
                let name = ret.message.split(";")[0];
                console.log(name)
                let avatarUrl = ret.message.split(";")[1];
                //根据返回值进行处理
                if (state === true) {
                    //存入cookie,直接跳转登陆状态
                    cookie.save('token', ret.authorizeToken);
                    cookie.save("name", name);
                    cookie.save("avatarUrl", "https://www.zjuse2017.club/"+avatarUrl);
                    window.location.href = "https://www.zjuse2017.club/";//直接打开新网页
                } else {
                    let message = ret.message;
                    console.log(message)
                    alert(message);
                }
            });
    }

    //实时更新state里面的值
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <div><img src="https://www.zjuse2017.club/bg.jpg" className="logo-img"/></div>
                <div className="login" style={{textAlign: 'center',fontSize:'30px'}}>
                    邮箱登录
                    <Form
                        className="login-form"
                        name="basic"
                        initialValues={{remember: true, size: "large"}}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{
                                required: true, message: '请输入邮箱!'
                            }, {
                                validator: this.checkEmail.bind(this)
                            }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                name="email"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{required: true, message: '请输入密码!'}]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                name="password"
                                placeholder="password"
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item className="login-form-remember" name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/modifypwd">
                                Forgot password
                            </a>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.submit}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login;
