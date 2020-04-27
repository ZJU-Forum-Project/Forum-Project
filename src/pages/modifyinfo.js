import {Layout} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import { Form, Input, Button, Breadcrumb, DatePicker} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import {RadioGroup, Radio} from 'react-radio-group'

const {Footer,Content} = Layout;
const tailLayout = {wrapperCol: { offset: 8, span: 16 },};
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

class modifyinfo extends React.Component{
    constructor(props){
        super(props);
         this.state = {
           email:'defaultemail@default.com',
           email_hidden:'',
           birthday:new Date(1900,1,1,0,0,0),     //切记Date是引用类型
           birthday_hidden:0,
           gender:'',
           gender_hidden:0,
           phone:'',
           phone_hidden:0,
           real_name:'',
           real_name_hidden:0,
           hometown:'',
           hometown_hidden:0,
           organization:'',
           organization_hidden:0,
           signature:'',
           signature_hidden:0,
           token:'',
        }

        //绑定需要调用的async函数
        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleGenderChange=this.handleGenderChange.bind(this);
        this.handleBirthdayHiddenChange=this.handleBirthdayHiddenChange.bind(this);
        this.handleGenderHiddenChange=this.handleGenderHiddenChange.bind(this);
        this.handlePhoneHiddenChange=this.handlePhoneHiddenChange.bind(this);
        this.handleRealNameHiddenChange=this.handleRealNameHiddenChange.bind(this);
        this.handleHometownHiddenChange=this.handleHometownHiddenChange.bind(this);
        this.handleOrganizationHiddenChange=this.handleOrganizationHiddenChange.bind(this);
        this.handleSignatureHiddenChange=this.handleSignatureHiddenChange.bind(this);
        this.load_info=this.load_info.bind(this);
        this.submit=this.submit.bind(this);  
    }


        //当输入框内的值发生改变时，触发此函数
        async handleInputChange(event){
            const target = event.target;
            const value =  target.value;
            const name = target.name;
            //由于多个组件需要监听Onchange，此处基于name修改对应的值
            this.setState({
              [name]: value    });
        }
        
        //当以下单选框选择发生改变时，触发相应函数
        async handleGenderChange(value){
            this.setState({gender: value});
        }
        async handleBirthdayHiddenChange(value){
            this.setState({birthday_hidden: value});
        }
        async handleGenderHiddenChange(value){
            this.setState({gender_hidden: value});
        }
        async handlePhoneHiddenChange(value){
            this.setState({phone_hidden: value});
        }
        async handleRealNameHiddenChange(value){
            this.setState({real_name_hidden: value});
        }
        async handleHometownHiddenChange(value){
            this.setState({hometown_hidden: value});
        }
        async handleOrganizationHiddenChange(value){
            this.setState({organization_hidden: value});
        }
        async handleSignatureHiddenChange(value){
            this.setState({signature_hidden: value});
        }
    
    
    //检查输入的email是否符合邮箱格式(若输入为空则不检查)
    checkEmail(rule,value,callback){
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if(!reg.test(value) && value!="" ){
            callback('请输入正确的邮箱地址');
        }
        callback();
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
                birthday_hidden:query_return.data.birth_hidden,
                gender: query_return.data.gender,
                gender_hidden:query_return.data.gender_hidden,
                phone: query_return.data.phone,
                phone_hidden:query_return.data.phone_hidden,
                real_name: query_return.data.real_name,
                real_name_hidden: query_return.data.real_name_hidden,
                hometown: query_return.data.hometown,
                hometown_hidden: query_return.data.hometown_hidden,
                organization: query_return.data.organization,
                organization_hidden: query_return.data.organization_hidden,
                signature: query_return.data.signature,
            }); 
        }
        console.log("Query Success!");
        console.log("%o",this.state);

    }



    //点击提交时，调用后端api，将修改后的数据传给服务器
    async submit(){
        console.log("submit() is called");

        let formData = new FormData();

        //读入cookie中的token
        let token=cookie.load('token');
        //读入state中的数据
        let email=this.state.email;
        var birth=this.state.birthday;
        let birth_hidden=this.state.birthday_hidden;
        let gender=this.state.gender;
        let gender_hidden=this.state.gender_hidden;
        let phone=this.state.phone;
        let phone_hidden=this.state.phone_hidden;
        let real_name=this.state.real_name;
        let real_name_hidden=this.state.real_name_hidden;
        let hometown=this.state.hometown;
        let hometown_hidden=this.state.hometown_hidden;
        let organization=this.state.organization;
        let organization_hidden=this.state.organization_hidden;
        let signature=this.state.signature;
        
        //非登录状态传输数据的方式
        formData.append('authorizeToken',token);
        formData.append('birth',birth);
        formData.append('birth_hidden',birth_hidden);
        formData.append('gender',gender);
        formData.append('gender_hidden',gender_hidden);
        formData.append('phone',phone);
        formData.append('phone_hidden',phone_hidden);
        formData.append('real_name',real_name);
        formData.append('real_name_hidden',real_name_hidden);
        formData.append('hometown',hometown);
        formData.append('hometown_hidden',hometown_hidden);
        formData.append('organization',organization);
        formData.append('organization_hidden',organization_hidden);
        formData.append('signature',signature);

        console.log("%o",formData);

        //调用后端queryinfo接口，发送信息,返回InfoMessage类对象
        let edit_return=(await axios.post('/api/editinfo',formData)).data;

        console.log("%o",edit_return);
        
        //如果查询失败，弹窗提示原因
        if(edit_return.data.state == false){
            alert(edit_return.data.message);
         }
         
         //如果查询成功
        else{
            window.location.href="http://106.12.27.104/personinfo";
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
        //以下两行代码：为方便前端进行界面，暂时使条件判断失效
        //if(1){
        if(cookie.load("token")){
            var iemail = this.state.email;
            var ibirthday = this.state.birthday;//实际显示月份多1
            var igender = this.state.gender;
            var iphone = this.state.phone;
            var ireal_name = this.state.real_name;
            var ihometown = this.state.hometown;
            var iorganization = this.state.organization;
            var isignature = this.state.signature;
            var iemail_hidden = this.state.email_hidden;
            var ibirthday_hidden = this.state.birthday_hidden;
            var igender_hidden = this.state.gender_hidden;
            var iphone_hidden = this.state.phone_hidden;
            var ireal_name_hidden = this.state.real_name_hidden;
            var ihometown = this.state.hometown;
            var iorganization_hidden = this.state.organization_hidden;
            var isignature_hidden = this.state.signature_hidden;

            return(
                <Layout className="layout">
                <NavigateBar />
                <Content style={{padding: '0 50px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content"style={{textAlign: 'center',fontSize:'30px'}}>
                        修改个人信息
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
                            rules={[{ 
                                max: 50, message: 'email不能多于50个字符!' 
                            },{
                                validator:this.checkEmail.bind(this)
                            }]}
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
                            
                            <DatePicker  placeholder={ibirthday.toLocaleDateString()} onChange={()=>this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Gender"
                        >
                            
                        <RadioGroup 
                            name="gender"
                            selectedValue={this.state.gender}
                            onChange={this.handleGenderChange}>
                            <Radio value="男" />Man
                            <Radio value="女" />Woman
                        </RadioGroup>


                            
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Phone"
                            name="phone"
                            rules={[{ 
                                max: 50, message: '电话号码不能多于50个字符!' 
                            }]}
                        >
                            <Input type="text" placeholder={iphone} onChange={this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Real_name"
                            name="real_name"
                            rules={[{ 
                                max: 50, message: '真实姓名不能多于50个字符!' 
                            }]}
                        >
                            <Input type="text" placeholder={ireal_name} onChange={this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Hometown"
                            name="hometown"
                            rules={[{ 
                                max: 50, message: '户籍所在地不能多于50个字符!' 
                            }]}
                        >
                            <Input type="text" placeholder={ihometown} onChange={this.handleInputChange}/>
                        </Form.Item>
                        
                        <Form.Item
                            style={{margin: '16px 100px 15px -200px'}}
                            label="Organization"
                            name="organization"
                            rules={[{ 
                                max: 50, placeholder: '组织名称不能多于50个字符!' 
                            }]}
                        >
                            <Input type="text" placeholder={iorganization} onChange={this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item
                        style={{margin: '16px 100px 15px -200px'}}
                            label="Signature"
                            name="signature"
                            rules={[{ 
                                max: 200, message: '个性签名不能多于200个字符!' 
                            }]}
                        >
                            <Input type="textarea" placeholder={isignature} onChange={this.handleInputChange}/>
                        </Form.Item>

                    </Form>
                    </div>

                    <div className="site-layout-content"style={{textAlign: 'center',fontSize:'30px'}}>
                        隐私设置
                        <br/><br/><br/>
                    <Form>
                        <Form.Item
                            style={{margin: '16px 100px 15px 300px'}}
                            label="是否隐藏生日"
                            name=""
                        >
                            <RadioGroup 
                                name="brithday_hidden"
                                selectedValue={this.state.birthday_hidden}
                                onChange={this.handleBirthdayHiddenChange}>
                                <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                            </RadioGroup>
                        </Form.Item>

                        <Form.Item
                                style={{margin: '16px 100px 15px 300px'}}
                            label="是否隐藏性别"
                            name=""
                        >
                            <RadioGroup 
                                name="gender_hidden"
                                selectedValue={this.state.gender_hidden}
                                onChange={this.handleGenderHiddenChange}>
                                <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                            </RadioGroup>
                        </Form.Item>

                        <Form.Item
                        style={{margin: '16px 100px 15px 300px'}}
                            label="是否隐藏电话"
                            name=""
                        >
                            <RadioGroup 
                                name="phone_hidden"
                                selectedValue={this.state.phone_hidden}
                                onChange={this.handlePhoneHiddenChange}>
                                <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                            </RadioGroup>
                        </Form.Item>

                        <Form.Item
                        style={{margin: '16px 100px 15px 300px'}}
                            label="是否隐藏真实姓名"
                            name=""
                        >
                            <RadioGroup 
                                name="real_name_hidden"
                                selectedValue={this.state.real_name_hidden}
                                onChange={this.handleRealNameHiddenChange}>
                                <Radio value={1} style={{margin: '0px 0px 0px -728px'}}/>是
                                <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                            </RadioGroup>
                        </Form.Item>

                        <Form.Item
                        style={{margin: '16px 100px 15px 300px'}}
                            label="是否隐藏家乡"
                            name=""
                        >
                            <RadioGroup 
                                name="hometown_hidden"
                                selectedValue={this.state.hometown_hidden}
                                onChange={this.handleHometownHiddenChange}>
                                <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                            </RadioGroup>
                        </Form.Item>

                        <Form.Item
                        style={{margin: '16px 100px 15px 300px'}}
                            label="是否隐藏组织"
                            name=""
                        >
                            <RadioGroup 
                                name="organization_hidden"
                                selectedValue={this.state.organization_hidden}
                                onChange={this.handleOrganizationHiddenChange}>
                                <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                            </RadioGroup>
                        </Form.Item>

                        <Form.Item 
                        style={{textAlign: 'center'}}
                        >
                            <Button type="primary"  onClick={this.submit}>
                                保存
                            </Button>
                            
                            <Link to="/personinfo">
                                <Button type="default" >
                                    取消
                                </Button>
                            </Link>
                        </Form.Item>
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
export default modifyinfo