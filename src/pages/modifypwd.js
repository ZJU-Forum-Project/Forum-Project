import {Layout} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import { Form, Input, Button, Breadcrumb} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';

const {Footer,Content} = Layout;

//样式
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 },};
const tailLayout = {wrapperCol: { offset: 8, span: 16 },};

async function onFinish(values){
    let email = values.email,password=values.password,token=values.token, autoken=cookie.load('token');
    let formData = new FormData();
    console.log("token: "+token+"||| autoken: "+autoken);
    formData.append('email',email);
    formData.append('password',password);
    formData.append('token',token);
    formData.append('Authorization',autoken);
    //METHOD 1:
    // axios.post('/api/modify',{
    //     data: formData
    // })
    //METHOD 2:
    axios.post('/api/modify', formData)
    //METHOD3:
    // axios({
    //     method: "POST",
    //     url: '/api/modify',
    //     data: formData,
    // })
    //METHOD4:
    // axios.defaults.headers.post['Authorization'] = autoken;
    // axios.post('/api/modify',formData)
    .then(res=>{
        console.log(res.data);
        let success=res.data.state;
        if(success){
            window.location.href="http://106.12.27.104/";
        }
    }).catch(err=>{
        alert("请先登录！"+err);
        window.location.href="http://106.12.27.104/";
    });
};
async function sendEmail(emailAddress){
    if(emailAddress!=""){
        let formData = new FormData();
        formData.append('email',emailAddress);
        let ret = (await axios.post('/api/applyEmail',formData)).data;
        let success = ret.state;
        if(success){
            alert("You have reived the email contains token!");
            return true;
        }
        else {
            alert("Some wrongs happened, please retry!");
        }
    }
    return false;
}

export default class Modifypwd extends React.Component{
    constructor (props) {
        super (props);
        this.state = {
            email: '',
            loading: false,
            yztime: 59
        }
    }
    //倒计60s
    count = () => {
    　　let { yztime } = this.state;
        this.setState({ loading: true });
    　　let siv = setInterval(() => {
    　　　　this.setState({ yztime: (yztime--) }, () => {
    　　　　　　if (yztime <= -1) {
    　　　　　　　　clearInterval(siv);　　//倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
    　　　　　　　　this.setState({ loading: false, yztime: 59 })
    　　　　　　}
    　　　　});
    　　}, 1000);
    }
    checkEmail(rule,value,callback){
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if(!reg.test(value)){
            callback('请输入正确的邮箱地址');
        }
        callback();
    }
    //邮箱地址
    modifyEmail (event) {
        let val = event.currentTarget.value;
        this.setState({
            email: val
        })
    }
    applyEmail(){
        let email = this.state.email;
        if(sendEmail(email)){
            this.count();
        }
    }

    render() {
        if(cookie.load("token")){
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <Content style={{padding: '0 50px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content">
                            修改密码
                            <br/><br/><br/>
                        <Form
                            {...layout}
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ 
                                        required: true, message: '请输入邮箱!' 
                                    },{
                                        validator:this.checkEmail.bind(this)
                                    }
                                ]}
                            >
                                <Input type="text" placeholder="请输入邮箱" onBlur={ this.modifyEmail.bind(this) }/>
                            </Form.Item>
        
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: '请输入密码!' }]}
                            >
                                <Input.Password placeholder="请输入密码"/>
                            </Form.Item>
                            <Form.Item
                                label="confirmPassword"
                                name="confirmpassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: '请确认密码!' },
                                    ({ getFieldValue }) => ({
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
                                label="Captcha"
                                name="token"
                                rules={[{ required: true, message: '请输入验证码!' }]}
                            >
                                <Input allowClear={true} placeholder="请输入验证码"/>
                            </Form.Item>
        
                            <Form.Item {...tailLayout}>
                                <Button onClick={this.applyEmail.bind(this)} loading={this.state.loading}>
                                {this.state.loading ? this.state.yztime + '秒' : '发送邮件验证'}
                                </Button>
                            </Form.Item>
        
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                提交
                                </Button>
                            </Form.Item>
                        </Form>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
                </Layout>
                );
        }
        else{
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <br/><br/><br/>
                    <h1 align="center">
                        请先登录！
                    </h1>
                </Layout>
            );
        }
    }
}