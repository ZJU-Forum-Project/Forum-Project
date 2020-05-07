import {Breadcrumb, Button, DatePicker, Form, Input, Layout} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import {Radio, RadioGroup} from 'react-radio-group'

const {Footer,Content} = Layout;
const tailLayout = {wrapperCol: { offset: 8, span: 16 },};
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

class personinfo extends React.Component{
    constructor(props){
        super(props);
         this.state = {
           email:'',
           birthday:new Date(1900,1,1),  //切记Date是引用类型
           gender:"男",
           phone:'',
           real_name:'',
           hometown:'',
           organization:'',
           signature:'',
           token:'',//token(若有)存储在本地cookie中
        }

        //绑定this指针（可以使用箭头函数来替代）
        this.load_info=this.load_info.bind(this);


    }
    




    //向后端发送token，接收InfoMessage类对象。若查询成功则将各项值加载到组件的state中，否则弹窗提示原因。
    async load_info(){
        console.log("load_info() is called");

        //读入cookie中的token
        let token=cookie.load('token');
        console.log("token: "+token);
        let formData = new FormData();
        //非登录状态传输数据的方式
        formData.append('token',token);
        formData.append('Authorization',token);

        //调用后端queryinfo接口，发送token,返回InfoMessage类对象
        let query_return=(await axios.post('/api/queryinfo',formData)).data;
        console.log("Show query_return:");
        console.log("%o",query_return);
        
        //如果查询失败，弹窗提示原因
        if(query_return.state == false){
           alert(query_return.message);
        }
        
        //如果查询成功
        else{
            console.log("Query Success!");

            //更新state
            if(query_return.email!=null){
                this.setState({
                    email: query_return.email
                }); 
            }
            if(query_return.birth!=null){
                this.setState({
                    birthday: query_return.birth
                }); 
            } 
            if(query_return.gender!=null&&query_return.gender!=""){
                this.setState({
                    gender: query_return.gender
                }); 
            } 
            if(query_return.phone!=null){
                this.setState({
                    phone: query_return.phone
                }); 
            } 
            if(query_return.real_name!=null){
                this.setState({
                    real_name: query_return.real_name
                }); 
            } 
            if(query_return.hometown!=null){
                this.setState({
                    hometown: query_return.hometown
                }); 
            } 
            if(query_return.organization!=null){
                this.setState({
                    organization: query_return.organization
                }); 
            } 
            if(query_return.signature!=null){
                this.setState({
                    signature: query_return.signature
                }); 
            } 

            console.log("information loaded!")
            console.log("Show this.state:");
            console.log("%o",this.state);

        }
        
        

    }
    

    //在渲染前调用
    componentWillMount(){
        console.log("componentWillMount() is called");
        
        if(cookie.load("token")){
            console.log("call load_info()");
            this.load_info(); 
        }
    }
    
    render() {

        console.log("render() is called");

        //若用户已登录
        //以下两行代码：为方便前端调试，暂时使条件判断失效
        //if(1){
        if(cookie.load("token")){

            var iemail = this.state.email;
            var ibirthday = this.state.birthday;
            var igender = this.state.gender;
            var iphone = this.state.phone;
            var ireal_name = this.state.real_name;
            var ihometown = this.state.hometown;
            var iorganization = this.state.organization;
            var isignature = this.state.signature;

            console.log("iphone=%s",iphone);

            return(
                <Layout className="layout">
                <NavigateBar />
                <Content style={{padding: '0 50px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="site-layout-content"style={{textAlign: 'center',fontSize:'30px'}}>
                        个人信息
                    <br/><br/><br/>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Email"
                            name="email"
                        >
                            <Input type="text" 
                                placeholder={iemail}
                                readonly="readonly"/>
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Birthday"
                            name="birthday"
                        >
                            
                            <DatePicker  placeholder={ibirthday} disabled/>
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Gender"
                        >
                            
                        <RadioGroup 
                            name="gender"
                            selectedValue={this.state.gender}
                            disabled>
                            <Radio value="男" />Man
                            <Radio value="女" />Woman
                        </RadioGroup>


                            
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Phone"
                            name="phone"
                        >
                            <Input type="text" placeholder={iphone} readonly="readonly" />
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Real_name"
                            name="real_name"
                        >
                            <Input type="text" placeholder={ireal_name} readonly="readonly"/>
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Hometown"
                            name="hometown"
                        >
                            <Input type="text" placeholder={ihometown} readonly="readonly"/>
                        </Form.Item>
                        
                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Organization"
                            name="organization"
                        >
                            <Input type="text" placeholder={iorganization} readonly="readonly"/>
                        </Form.Item>

                        <Form.Item
                        style={{margin: '16px 100px 15px -200px'}}
                            label="Signature"
                            name="signature"
                        >
                            <Input type="textarea" placeholder={isignature} readonly="readonly"/>
                        </Form.Item>
                        
                        
                        <Link to="/modifyinfo">
                            <Button className="e-button" type="primary"  >
                                修改个人信息
                            </Button>
                        </Link>

                    </Form>
                    </div>

                </Content>
                </Layout>
            
            )


        }
        
        //若用户未登录，显示登录提示界面
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
export default personinfo
