import React from 'react';
import {Button, Carousel, Form, Input} from 'antd';
import cookie from 'react-cookies';
import axios from 'axios';
import '../asset/register.css';
import './config';

import registerImg1 from "../img/register-1.jpg";
import registerImg2 from "../img/register-2.jpg";
import registerImg3 from "../img/register-3.jpg";
import registerImg4 from "../img/register-4.jpg";

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
    async submit() {
        //非登录状态传输数据的方式:使用formData
        let formData = new FormData();
        formData.append('password', this.state.password);
        formData.append('email', this.state.email);
        ////调用后端api,并存储返回值
        let ret = (await axios.post(global.constants.url+'api/login', formData)).data;
        let state = ret.state;
        let name = ret.message.split(";")[1];
        //根据返回值进行处理
        if (state === true) {
            //存入cookie,直接跳转登陆状态
            cookie.save('token', ret.authorizeToken);
            cookie.save("name", name);
            window.location.href = "http://106.12.27.104/";//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    //实时更新state里面的值
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <Form
                    name="basic"
                    initialValues={{remember: true}}
                    style={{marginLeft: "2%", marginTop: "2%", width: "75%"}}
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
                        <Input type="text" name="email" onChange={this.handleChange}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true, message: '请输入密码!'}]}
                    >
                        <Input.Password name="password" onChange={this.handleChange}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={this.submit}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
                <div>
                    <Carousel>
                        <div><img src={registerImg1} className="logo-img"/></div>
                        <div><img src={registerImg2} className="logo-img"/></div>
                        <div><img src={registerImg3} className="logo-img"/></div>
                        <div><img src={registerImg4} className="logo-img"/></div>
                    </Carousel>
                </div>
            </div>
        )
    }
}

export default Login;
