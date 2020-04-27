
import {Layout} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import { Button,Form, Input, DatePicker,Breadcrumb} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';

const {Footer,Content} = Layout;
const tailLayout = {wrapperCol: { offset: 8, span: 16 },};
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

class personinfo extends React.Component{
    constructor(props){
        super(props);
         this.state = {
           email:'',
           birthday:new Date(1900,1,1),  //切记Date是引用类型
           gender:'',
           phone:'',
           real_name:'',
           hometown:'',
           organization:'',
           signature:'',
           token:'',//token(若有)存储在本地cookie中
        }

        //绑定需要调用的async函数
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
        formData.append('authorizeToken',token);

        //调用后端queryinfo接口，发送token,返回InfoMessage类对象
        let query_return=(await axios.post('/api/queryinfo',formData)).data;
        console.log("%o",query_return);
        
        //如果查询失败，弹窗提示原因
        if(query_return.data.state == false){
           alert(query_return.data.message);
        }
        
        //如果查询成功
        else{
            //更新state
            this.setState({
                email: query_return.data.email,
                birthday: query_return.data.birth,
                gender: query_return.data.gender,
                phone: query_return.data.phone,
                real_name: query_return.data.real_name,
                hometown: query_return.data.hometown,
                organization: query_return.data.organization,
                signature: query_return.data.signature
            }); 
            console.log("Query Success!");
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
                            label="Email"
                            name="email"
                        >
                            <Input type="text" readonly="readonly" value={iemail} />                
                        </Form.Item>
                
                        <Form.Item
                            label="Birthday"
                            name="birthday"
                        >
                            <DatePicker value={ibirthday} value={ibirthday}/>
                        </Form.Item>

                        <Form.Item
                            label="Gender"
                            name="gender"
                        >
                            <input type="radio" name='gender' value="男" disabled 
                                checked={igender=="男"?true:false}/>Man
                            <input type="radio" name='gender' value="女" disabled
                                checked={igender=="女"?true:false}/>Woman
                            

                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                        >
                            <Input type="text" readonly="readonly" value={iphone}/>
                        </Form.Item>

                        <Form.Item
                            label="Real_name"
                            name="real_name"
                        >
                            <Input type="text"  readonly="readonly" value={ireal_name}/>
                        </Form.Item>

                        <Form.Item
                            label="Hometown"
                            name="hometown"
                        >
                            <Input type="text" readonly="readonly"value={ihometown}/>
                        </Form.Item>

                        <Form.Item
                            label="Organization"
                            name="organization"
                        >
                            <Input type="text" readonly="readonly" value={iorganization}/>
                        </Form.Item>

                        <Form.Item
                            label="Signature"
                            name="signature"
                        >
                            <Input type="textarea" readonly="readonly" value={isignature}/>
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