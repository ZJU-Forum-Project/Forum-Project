import {Breadcrumb, Button, DatePicker, Form, Input, Layout, Radio} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import NotLogin from "../components/notlogin";
import './config';

const {Content} = Layout;
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

class otherinfo extends React.Component {
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
            src: '',
            originalAvatar: '',
            originalSrc: '',
            preview:'',
        }

        //绑定this指针（可以使用箭头函数来替代）
        this.load_info = this.load_info.bind(this);
    }


    //向后端发送token，接收InfoMessage类对象。若查询成功则将各项值加载到组件的state中，否则弹窗提示原因。
    async load_info() {

        //读入cookie中的token
        let token = cookie.load('token');
        let formData = new FormData();
        //非登录状态传输数据的方式
        formData.append('token', token);
        formData.append('Authorization', token);

        //调用后端queryinfo接口，发送token,返回InfoMessage类对象
        let query_return = (await axios.post(global.constants.url + '/api/queryinfo', formData)).data;

        //如果查询失败，弹窗提示原因
        if (query_return.state === false) {
            alert(query_return.message);
        }

        //如果查询成功
        else {

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
            if (query_return.avatarUrl != null) {
                this.setState({
                    originalAvatar: query_return.avatarUrl
                });
                let query_avatar = await axios.get('/api/getBase64PictureByUrl', {
                    params: {
                        url: this.state.originalAvatar
                    }
                });
                if (query_avatar.status == 200) {
                    this.setState({
                        originalSrc: query_avatar.data,
                        preview: query_avatar.data,
                    });
                }
                else if (query_avatar.status != 200) {
                    alert(query_return.message);
                }

            }
            else {
            }
        }


    }


    //在渲染前调用
    componentWillMount() {
        if (cookie.load("token")) {
            this.load_info();
        }
    }

    render() {
        if (cookie.load("token")) {
            let iemail = this.state.email;
            let ibirthday = this.state.birthday;
            let iphone = this.state.phone;
            let ireal_name = this.state.real_name;
            let ihometown = this.state.hometown;
            let iorganization = this.state.organization;
            let isignature = this.state.signature;

            return (
                <Layout className="layout">
                    <Content style={{padding: '0 50px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>个人信息</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content"style={{textAlign: 'center',fontSize:'30px'}}>
                            个人信息
                            <Form {...layout}
                                  name="basic"
                                  initialValues={{ remember: true }}
                            >
                                <Form.Item
                                    style={{ margin: '16px 100px 15px -200px' }}
                                    label="Profile"
                                    name="avatar"
                                >
                                    <div style={{ Align: 'center' }}>
                                        <img src={this.state.preview} width="100px" height="100px" alt="" style={{ borderRadius: '100%', borderStyle: 'solid', borderColor: '#DCDCDC' }} />
                                    </div>
                                </Form.Item>

                                <Form.Item label="邮箱" name="email"
                                           style={{margin: '16px 100px 15px -200px'}}>
                                    <Input type="text" placeholder={iemail} disabled/>
                                </Form.Item>
                                <Form.Item label="生日" name="birthday"style={{margin: '16px 100px 15px -200px'}}>
                                    <DatePicker placeholder={ibirthday} disabled/>
                                </Form.Item>

                                <Form.Item label="性别" style={{margin: '16px 100px 15px -200px'}}>
                                    <Radio.Group name="gender" defaultValue={this.state.gender} disabled>
                                        <Radio.Button value="男" style={{width: "150px"}}>男孩纸</Radio.Button>
                                        <Radio.Button value="女" style={{width: "150px"}}>女孩纸</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="手机号" name="phone" style={{margin: '16px 100px 15px -200px'}}>
                                    <Input type="text" placeholder={iphone} disabled/>
                                </Form.Item>

                                <Form.Item label="真实姓名" name="real_name"
                                           style={{margin: '16px 100px 15px -200px'}}>
                                    <Input type="text" placeholder={ireal_name} disabled/>
                                </Form.Item>

                                <Form.Item label="故乡" name="hometown" style={{margin: '16px 100px 15px -200px'}}>
                                    <Input type="text" placeholder={ihometown} disabled/>
                                </Form.Item>

                                <Form.Item label="机构" style={{margin: '16px 100px 15px -200px'}} name="organization">
                                    <Input type="text" placeholder={iorganization} disabled/>
                                </Form.Item>

                                <Form.Item style={{margin: '16px 100px 15px -200px'}} label="个性签名" name="signature">
                                    <Input type="textarea" placeholder={isignature} disabled/>
                                </Form.Item>

                                <Link to="/modifyinfo">
                                    <Button className="e-button" type="primary">
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
        else {
            return <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>;
        }
    }
}

export default otherinfo;
