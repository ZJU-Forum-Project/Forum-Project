import {Breadcrumb, Button, Form, Input, Layout, Col, Row} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import NotLogin from "../components/notlogin";
import './config';

const {Content} = Layout;
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

async function onFinish(values) {
    let email = values.email, password = values.password;
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    axios.post(global.constants.url + '/api/modify', formData)
        .then(res => {
            let success = res.data.state;
            if (success) {
                window.location.href = "https://www.zjuse2017.club/";
            }
        }).catch(err => {
        alert("请先登录！" + err);
        window.location.href = "https://www.zjuse2017.club/";
    });
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

async function sendEmail(emailAddress) {
    if (emailAddress !== "") {
        let formData = new FormData();
        formData.append('email', emailAddress);
        let ret = (await axios.post(global.constants.url + '/api/applyEmail', formData)).data;
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
                <Layout className="layout" style={{backgroundColor:"#ffffff"}}>
                    <Content style={{padding: '0 50px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>修改密码</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content" style={{textAlign: 'center',fontSize:'30px', marginRight:'50px'}}>
                            修改密码
                            <Form {...layout}
                                name="basic"
                                initialValues={{remember: true}}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    style={{ margin: '16px 100px 15px -200px' }}
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
                                    style={{ margin: '16px 100px 15px -200px' }}
                                    label="密码"
                                    name="password"
                                    rules={[{required: true, message: '请输入密码!'}]}
                                >
                                    <Input.Password placeholder="请输入密码"/>
                                </Form.Item>
                                <Form.Item
                                    style={{ margin: '16px 100px 15px -200px' }}
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
                                    style={{ margin: '16px 100px 15px -200px' }}
                                    label="验证码"
                                    name="token"
                                >
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="token"
                                                noStyle
                                                rules={[{ required: true, message: '请输入验证码!' }]}
                                            >
                                                <Input name="token" allowClear={true}
                                                       onChange={this.handleChange}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={this.applyEmail.bind(this)} loading={this.state.loading}
                                                    style={{marginRight: "5%"}}>
                                                {this.state.loading ? this.state.time + '秒' : '发送邮件验证'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item style={{textAlign: 'center'}}>
                                    <Button type="primary" htmlType="submit" className="headline">
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Content>
                </Layout>
            );
        } else {
            return (
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }
}
