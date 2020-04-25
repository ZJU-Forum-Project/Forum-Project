import React from 'react';
import logo from '../picture/ZJU.jpg';
import {Form,Input,Breadcrumb,Button,List,Layout} from 'antd';
import cookie from 'react-cookies';
import axios from 'axios';
import '../asset/register.css';
const {Footer,Content} = Layout;

const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};
const tailLayout = {wrapperCol: { offset: 8, span: 16 },};

class Login extends React.Component{
      constructor(props){
          super(props);
      this.state = {
         password:'',
         email:'',//只提供邮箱登录
      }
      //绑定需要调用的async函数
      this.handleChange=this.handleChange.bind(this);
      this.submit=this.submit.bind(this);
  }
  //检查邮箱
   checkEmail(rule,value,callback){
       const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
       if(!reg.test(value)){
           callback('请输入正确的邮箱地址');
       }
       callback();
   }
   //调用后端邮箱api
  async submit(){
     console.log(this.state);
     //非登录状态传输数据的方式:使用formData
     let formData = new FormData();
     formData.append('password',this.state.password);
     formData.append('email',this.state.email);
     ////调用后端api,并存储返回值
     let ret=(await axios.post('/api/login',formData)).data;
     let state=ret.state;
     let name=ret.message.split(";")[1];
     //根据返回值进行处理
     if(state==true){
         //存入cookie,直接跳转登陆状态
         cookie.save('token',ret.authorizeToken);
         cookie.save("name",name);
         window.location.href="http://106.12.27.104/";//直接打开新网页
     }
     else {
        let message=ret.message;
        alert(message);
     }
  }
  //实时更新state里面的值
  handleChange(event) {
     this.setState({[event.target.name]: event.target.value});
  }
  render(){
    return(
      <div>
            <div className="logo-container"> 
                  <img className="logo-img"  src={logo} />
            </div>
            <Layout className="layout">
                    <Content style={{padding: '50px 0 0 200px'}}>
                        <Form
                            {...layout}
                            name="basic"
                            initialValues={{ remember: true }}
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
                                <Input style={{width:"30%"}} type="text"  name="email" onChange={this.handleChange} />
                            </Form.Item>
        
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: '请输入密码!' }]}
                            >
                                <Input.Password style={{width:"30%"}}  name="password" onChange={this.handleChange}/>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit"  onClick={this.submit}>
                                提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
    </div>
           )
      }
}
 
export default Login;