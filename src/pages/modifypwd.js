import {Button, Form, Input} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import NotLogin from "../components/notlogin";

async function onFinish(values) {
    let email = values.email, password = values.password, autoken = cookie.load('token');
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('Authorization', autoken);
    axios.post('/api/modify', formData)
        .then(res => {
            let success = res.data.state;
            if (success) {
                window.location.href = "http://106.12.27.104/";
            }
        }).catch(err => {
        alert("请先登录！" + err);
        window.location.href = "http://106.12.27.104/";
    });
};

async function sendEmail(emailAddress) {
    if (emailAddress != "") {
        let formData = new FormData();
        formData.append('email', emailAddress);
        let ret = (await axios.post('/api/applyEmail', formData)).data;
        let success = ret.state;
        if (success) {
            alert("You have reived the email contains token!");
            return true;
        } else {
            alert("Some wrongs happened, please retry!");
        }
    }
    return false;
}

export default class Modifypwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading: false,
            yztime: 59
        }
    }

    //倒计60s
    count = () => {
        let {yztime} = this.state;
        this.setState({loading: true});
        let siv = setInterval(() => {
            this.setState({yztime: (yztime--)}, () => {
                if (yztime <= -1) {
                    clearInterval(siv);　　//倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
                    this.setState({loading: false, yztime: 59})
                }
            });
        }, 1000);
    };

    checkEmail(rule, value, callback) {
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
            callback('请输入正确的邮箱地址');
        }
        callback();
    }

    modifyEmail(event) {
        let val = event.currentTarget.value;
        this.setState({
            email: val
        })
    }

    applyEmail() {
        let email = this.state.email;
        if (sendEmail(email)) {
            this.count();
        }
    }

    render() {
        if (cookie.load("token")) {
            return (
                <div>
                    <div className="site-layout-content">
                        修改密码
                        <br/><br/><br/>
                        <Form
                            name="basic"
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="邮箱"
                                name="email"
                                rules={[{
                                    required: true, message: '请输入邮箱!'
                                }, {
                                    validator: this.checkEmail.bind(this)
                                }
                                ]}
                            >
                                <Input type="text" placeholder="请输入邮箱" onBlur={this.modifyEmail.bind(this)}/>
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[{required: true, message: '请输入密码!'}]}
                            >
                                <Input.Password placeholder="请输入密码"/>
                            </Form.Item>
                            <Form.Item
                                label="确认密码"
                                name="confirmpassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {required: true, message: '请确认密码!'},
                                    ({getFieldValue}) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('两个密码不一致!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="请确认密码"/>
                            </Form.Item>
                            <Form.Item
                                label="验证码"
                                name="token"
                                rules={[{required: true, message: '请输入验证码!'}]}
                            >
                                <Input allowClear={true} placeholder="请输入验证码"/>
                            </Form.Item>

                            <Form.Item>
                                <Button onClick={this.applyEmail.bind(this)} loading={this.state.loading}>
                                    {this.state.loading ? this.state.yztime + '秒' : '发送邮件验证'}
                                </Button>
                                <Button type="primary" htmlType="submit" className="headline">
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }
}
