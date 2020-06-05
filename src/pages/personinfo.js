import {Button, DatePicker, Form, Input, Radio} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import NotLogin from "../components/notlogin";
import './config';


class personinfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            birthday: new Date(1900, 1, 1),
            gender: "男",
            phone: '',
            real_name: '',
            hometown: '',
            organization: '',
            signature: '',
            token: '',//token(若有)存储在本地cookie中
        }

        //绑定this指针（可以使用箭头函数来替代）
        this.load_info = this.load_info.bind(this);
    }


    //向后端发送token，接收InfoMessage类对象。若查询成功则将各项值加载到组件的state中，否则弹窗提示原因。
    async load_info() {
        console.log("load_info() is called");

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
            if (query_return.gender !== null && query_return.gender !== "") {
                this.setState({
                    gender: query_return.gender
                });
            }
            if (query_return.phone !== null) {
                this.setState({
                    phone: query_return.phone
                });
            }
            if (query_return.real_name !== null) {
                this.setState({
                    real_name: query_return.real_name
                });
            }
            if (query_return.hometown !== null) {
                this.setState({
                    hometown: query_return.hometown
                });
            }
            if (query_return.organization !== null) {
                this.setState({
                    organization: query_return.organization
                });
            }
            if (query_return.signature !== null) {
                this.setState({
                    signature: query_return.signature
                });
            }
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

        if (cookie.load("token")) {
            let iemail = this.state.email;
            let ibirthday = this.state.birthday;
            let iphone = this.state.phone;
            let ireal_name = this.state.real_name;
            let ihometown = this.state.hometown;
            let iorganization = this.state.organization;
            let isignature = this.state.signature;

            return (
                <div>
                    <h1 className="headline">个人信息</h1>
                    <Form name="basic" initialValues={{remember: true}} className="headline">
                        <Form.Item label="邮箱" name="email"
                                   className={{width: "40%", float: "left", marginRight: "50px"}}>
                            <Input type="text" placeholder={iemail} disabled/>
                        </Form.Item>
                        <Form.Item label="生日" name="birthday" style={{width: "50%"}}>
                            <DatePicker placeholder={ibirthday} disabled style={{width: "300px"}}/>
                        </Form.Item>

                        <Form.Item label="性别" style={{width: "40%", float: "left", marginRight: "50px"}}>
                            <Radio.Group name="gender" defaultValue={this.state.gender} disabled>
                                <Radio.Button value="男" style={{width: "150px"}}>男孩纸</Radio.Button>
                                <Radio.Button value="女" style={{width: "150px"}}>女孩纸</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="手机号" name="phone" style={{width: "50%"}}>
                            <Input type="text" placeholder={iphone} disabled/>
                        </Form.Item>

                        <Form.Item label="真实姓名" name="real_name"
                                   style={{width: "40%", float: "left", marginRight: "50px"}}>
                            <Input type="text" placeholder={ireal_name} disabled/>
                        </Form.Item>

                        <Form.Item label="故乡" name="hometown" style={{width: "50%"}}>
                            <Input type="text" placeholder={ihometown} disabled/>
                        </Form.Item>

                        <Form.Item label="机构" style={{width: "90%"}} name="organization">
                            <Input type="text" placeholder={iorganization} disabled/>
                        </Form.Item>

                        <Form.Item style={{width: "90%"}} label="个性签名" name="signature">
                            <Input type="textarea" placeholder={isignature} disabled/>
                        </Form.Item>


                        <Link to="/modifyinfo">
                            <Button className="e-button" type="primary">
                                修改个人信息
                            </Button>
                        </Link>
                    </Form>
                </div>
            )


        }

        //若用户未登录，显示登录提示界面
        else {
            return <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>;
        }
    }
}

export default personinfo;
