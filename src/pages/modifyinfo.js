import {Button, DatePicker, Form, Input, Radio} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import NotLogin from "../components/notlogin";
import './config';

class modifyinfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'defaultemail@default.com',
            email_hidden: '',
            birthday: new Date(1900, 1, 1, 0, 0, 0),     //切记Date是引用类型
            birthday_string: "",
            birthday_hidden: 0,
            gender: "男",
            gender_hidden: 0,
            phone: '',
            phone_hidden: 0,
            real_name: '',
            real_name_hidden: 0,
            hometown: '',
            hometown_hidden: 0,
            organization: '',
            organization_hidden: 0,
            signature: '',
            signature_hidden: 0,
            token: '',
        }

        //绑定this指针（可以使用箭头函数来替代）
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.handleBirthdayHiddenChange = this.handleBirthdayHiddenChange.bind(this);
        this.handleGenderHiddenChange = this.handleGenderHiddenChange.bind(this);
        this.handlePhoneHiddenChange = this.handlePhoneHiddenChange.bind(this);
        this.handleRealNameHiddenChange = this.handleRealNameHiddenChange.bind(this);
        this.handleHometownHiddenChange = this.handleHometownHiddenChange.bind(this);
        this.handleOrganizationHiddenChange = this.handleOrganizationHiddenChange.bind(this);
        this.handleSignatureHiddenChange = this.handleSignatureHiddenChange.bind(this);
        this.load_info = this.load_info.bind(this);
        this.submit = this.submit.bind(this);
    }


    //当输入框内的值发生改变时，触发此函数
    handleInputChange(event) {

        console.log("handleInputChange(event) is called");
        console.log("Show event.target");
        console.log("%o", event.target);

        //由于多个组件需要监听Onchange，此处基于name修改对应的值
        this.setState({[event.target.name]: event.target.value});
    }

    handleBirthdayChange = (value, dateString) => {
        console.log("handleBirthdayChange(date,datestring) is called");
        this.setState({
            birthday: value,
            birthday_string: dateString
        });
        console.log("Show this.state.birthday:");
        console.log(this.state.birthday);
        console.log("Show this.state.birthday_string:");
        console.log("%o", this.state.birthday_string);

    }
    handleBirthdayOk = (value) => {
        console.log("handleBirthdayOk(value) is called");
        this.setState({birthday: value});
        console.log("Show this.state.birthday:");
        console.log(this.state.birthday);

    }

    //当以下单选框选择发生改变时，触发相应函数
    handleGenderChange(value) {
        this.setState({gender: value});
    }

    handleBirthdayHiddenChange(value) {
        this.setState({birthday_hidden: value});
    }

    handleGenderHiddenChange(value) {
        this.setState({gender_hidden: value});
    }

    handlePhoneHiddenChange(value) {
        this.setState({phone_hidden: value});
    }

    handleRealNameHiddenChange(value) {
        this.setState({real_name_hidden: value});
    }

    handleHometownHiddenChange(value) {
        this.setState({hometown_hidden: value});
    }

    handleOrganizationHiddenChange(value) {
        this.setState({organization_hidden: value});
    }

    handleSignatureHiddenChange(value) {
        this.setState({signature_hidden: value});
    }


    //检查输入的email是否符合邮箱格式(若输入为空则不检查)
    checkEmail(rule, value, callback) {
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value) && value !== "") {
            callback('请输入正确的邮箱地址');
        }
        callback();
    }


    async load_info() {
        //读入cookie中的token
        let token = cookie.load('token');
        console.log("token: " + token);

        let formData = new FormData();
        //非登录状态传输数据的方式
        formData.append('token', token);
        formData.append('Authorization', token);

        //调用后端queryinfo接口，发送token,返回InfoMessage类对象
        let query_return = (await axios.post(global.constants.url + '/api/queryinfo', formData)).data;
        console.log("Show query_return:");
        console.log("%o", query_return);

        //如果查询失败，弹窗提示原因
        if (query_return.state === false) {
            alert(query_return.message);
        }

        //如果查询成功
        else {
            console.log("Query Success!");

            //更新state
            if (query_return.email !== null) {
                this.setState({
                    email: query_return.email
                });
            }
            if (query_return.birth !== null) {
                this.setState({
                    birthday: query_return.birth
                });
            }
            if (query_return.birth_hidden !== null) {
                this.setState({
                    birthday_hidden: query_return.birth_hidden
                });
            }
            if (query_return.gender !== null && query_return.gender !== "") {
                this.setState({
                    gender: query_return.gender
                });
            }
            if (query_return.gender_hidden !== null) {
                this.setState({
                    gender_hidden: query_return.gender_hidden
                });
            }
            if (query_return.phone !== null) {
                this.setState({
                    phone: query_return.phone
                });
            }
            if (query_return.phone_hidden !== null) {
                this.setState({
                    phone_hidden: query_return.phone_hidden
                });
            }
            if (query_return.real_name !== null) {
                this.setState({
                    real_name: query_return.real_name
                });
            }
            if (query_return.real_name_hidden !== null) {
                this.setState({
                    real_name_hidden: query_return.real_name_hidden
                });
            }
            if (query_return.hometown !== null) {
                this.setState({
                    hometown: query_return.hometown
                });
            }
            if (query_return.hometown_hidden !== null) {
                this.setState({
                    hometown_hidden: query_return.hometown_hidden
                });
            }
            if (query_return.organization !== null) {
                this.setState({
                    organization: query_return.organization
                });
            }
            if (query_return.organization_hidden !== null) {
                this.setState({
                    organization_hidden: query_return.organization_hidden
                });
            }
            if (query_return.signature !== null) {
                this.setState({
                    signature: query_return.signature
                });
            }

            console.log("information loaded!")
            console.log("Show this.state:");
            console.log("%o", this.state);

        }


    }


    //点击提交时，调用后端api，将修改后的数据传给服务器
    async submit() {
        console.log("submit() is called");

        let formData = new FormData();

        //读入cookie中的token
        let token = cookie.load('token');
        //读入state中的数据
        var birth = this.state.birthday_string;
        let birth_hidden = this.state.birthday_hidden;
        let gender = this.state.gender;
        let gender_hidden = this.state.gender_hidden;
        let phone = this.state.phone;
        let phone_hidden = this.state.phone_hidden;
        let real_name = this.state.real_name;
        let real_name_hidden = this.state.real_name_hidden;
        let hometown = this.state.hometown;
        let hometown_hidden = this.state.hometown_hidden;
        let organization = this.state.organization;
        let organization_hidden = this.state.organization_hidden;
        let signature = this.state.signature;

        //非登录状态传输数据的方式
        formData.append('token', token);
        formData.append('Authorization', token);
        formData.append('birth', birth);
        formData.append('birth_hidden', birth_hidden);
        formData.append('gender', gender);
        formData.append('gender_hidden', gender_hidden);
        formData.append('phone', phone);
        formData.append('phone_hidden', phone_hidden);
        formData.append('real_name', real_name);
        formData.append('real_name_hidden', real_name_hidden);
        formData.append('hometown', hometown);
        formData.append('hometown_hidden', hometown_hidden);
        formData.append('organization', organization);
        formData.append('organization_hidden', organization_hidden);
        formData.append('signature', signature);

        console.log("Show each var[a,b] in formData.entries()");
        for (var [a, b] of formData.entries()) {
            console.log(a, b);
        }

        //调用后端queryinfo接口，发送信息,返回InfoMessage类对象
        let edit_return = (await axios.post(global.constants.url + '/api/editinfo', formData)).data;

        console.log("Show edit_return:");
        console.log("%o", edit_return);

        //如果查询失败，弹窗提示原因
        if (edit_return.state === false) {
            alert(edit_return.message);
        }

        //如果查询成功
        else {
            window.location.href = "http://106.12.27.104/personinfo";
        }
    }

    //在渲染前调用
    componentWillMount() {
        console.log("componentWillMount() is called");

        if (cookie.load("token")) {
            console.log("call load_info()");
            this.load_info();
        }
    }

    render() {

        console.log("render() is called");

        //若用户已登录
        //以下两行代码：为方便前端进行界面，暂时使条件判断失效
        //if(1){
        if (cookie.load("token")) {
            var iemail = this.state.email;
            var ibirthday = this.state.birthday;//实际显示月份多1
            var iphone = this.state.phone;
            var ireal_name = this.state.real_name;
            var iorganization = this.state.organization;
            var isignature = this.state.signature;
            var ihometown = this.state.hometown;

            return (
                <div>
                    <h1 className="headline">修改个人信息</h1>
                    <Form name="basic" initialValues={{remember: true}} className="headline">
                        <Form.Item label="邮箱" name="email"
                                   rules={[{
                                       max: 50, message: 'email不能多于50个字符!'
                                   }, {
                                       validator: this.checkEmail.bind(this)
                                   }]}
                                   style={{width: "80%"}}>
                            <Input type="text" placeholder={iemail} disabled/>
                        </Form.Item>

                        <Form.Item
                            label="生日"
                            name="birthday"
                            style={{width: "40%", float: "left", marginRight: "50px"}}
                        >
                            <DatePicker name="birthday" placeholder={ibirthday}
                                        value={ibirthday}
                                        onChange={this.handleBirthdayChange}
                                        onOk={this.handleBirthdayOk}
                                        style={{width: "300px"}}
                            />
                        </Form.Item>

                        <Form.Item style={{width: "50%"}}>
                            <Radio.Group
                                name="brithday_hidden"
                                defaultValue={this.state.birthday_hidden}
                                onChange={this.handleBirthdayHiddenChange}>
                                <Radio.Button value={1} style={{width: "150px"}}>隐藏生日</Radio.Button>
                                <Radio.Button value={0} style={{width: "150px"}}>显示生日</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="性别"
                                   style={{width: "40%", float: "left", marginRight: "50px"}}>
                            <Radio.Group
                                name="gender"
                                defaultValue={this.state.gender}
                                onChange={this.handleGenderChange}>
                                <Radio.Button value="男" style={{width: "150px"}}>Man</Radio.Button>
                                <Radio.Button value="女" style={{width: "150px"}}>Woman</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item style={{width: "50%"}}>
                            <Radio.Group
                                name="gender_hidden"
                                defaultValue={this.state.gender_hidden}
                                onChange={this.handleGenderHiddenChange}>
                                <Radio.Button value={1} style={{width: "150px"}}>隐藏性别</Radio.Button>
                                <Radio.Button value={0} style={{width: "150px"}}>显示性别</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="电话号码" name="phone"
                                   rules={[{
                                       max: 50, message: '电话号码不能多于50个字符!'
                                   }]}
                                   style={{width: "40%", float: "left", marginRight: "50px"}}
                        >
                            <Input name="phone" type="text" placeholder={iphone} value={iphone}
                                   onChange={this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item style={{width: "50%"}}>
                            <Radio.Group
                                name="phone_hidden"
                                defaultValue={this.state.phone_hidden}
                                onChange={this.handlePhoneHiddenChange}>
                                <Radio.Button value={1} style={{width: "150px"}}>隐藏电话</Radio.Button>
                                <Radio.Button value={0} style={{width: "150px"}}>显示电话</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="真实姓名" name="real_name"
                                   rules={[{
                                       max: 50, message: '真实姓名不能多于50个字符!'
                                   }]}
                                   style={{width: "40%", float: "left", marginRight: "50px"}}
                        >
                            <Input name="real_name" type="text" placeholder={ireal_name}
                                   value={this.state.real_name} onChange={this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item style={{width: "50%"}}>
                            <Radio.Group
                                name="real_name_hidden"
                                defaultValue={this.state.real_name_hidden}
                                onChange={this.handleRealNameHiddenChange}>
                                <Radio.Button value={1} style={{width: "150px"}}>隐藏真实姓名</Radio.Button>
                                <Radio.Button value={0} style={{width: "150px"}}>显示真实姓名</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="所在地" name="hometown"
                                   style={{width: "40%", float: "left", marginRight: "50px"}}
                                   rules={[{
                                       max: 50, message: '户籍所在地不能多于50个字符!'
                                   }]}
                        >
                            <Input name="hometown" type="text" placeholder={ihometown} value={ihometown}
                                   onChange={this.handleInputChange}/>
                        </Form.Item>

                        <Form.Item style={{width: "50%"}}>
                            <Radio.Group
                                name="hometown_hidden"
                                defaultValue={this.state.hometown_hidden}
                                onChange={this.handleHometownHiddenChange}>
                                <Radio.Button value={1} style={{width: "150px"}}>隐藏所在地</Radio.Button>
                                <Radio.Button value={0} style={{width: "150px"}}>显示所在地</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="所属组织" name="organization"
                                   style={{width: "40%", float: "left", marginRight: "50px"}}
                                   rules={[{
                                       max: 50, placeholder: '组织名称不能多于50个字符!'
                                   }]}>
                            <Input name="organization" type="text" placeholder={iorganization}
                                   value={iorganization} onChange={this.handleInputChange}/>
                        </Form.Item>
                        <Form.Item style={{width: "50%"}}>
                            <Radio.Group
                                name="organization_hidden"
                                defaultValue={this.state.organization_hidden}
                                onChange={this.handleOrganizationHiddenChange}>
                                <Radio.Button value={1} style={{width: "150px"}}>隐藏组织</Radio.Button>
                                <Radio.Button value={0} style={{width: "150px"}}>显示组织</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="个性签名" name="signature"
                                   style={{width: "80%"}}
                                   rules={[{max: 200, message: '个性签名不能多于200个字符!'}]}>
                            <Input name="signature" type="textarea" placeholder={isignature} value={isignature}
                                   onChange={this.handleInputChange}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.submit} style={{marginRight: "20px"}}>
                                保存
                            </Button>
                            <Link to="/personinfo">
                                <Button type="default">
                                    取消
                                </Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </div>);
        } else {
            return (
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }
}

export default modifyinfo
