import { Layout,Button, PageHeader, Card, Form} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css";
import { Link } from "react-router-dom";
const { Footer, Content } = Layout;
export default class modifyPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "", //帖子id
            token: "", //验证
            title: "",
            content: "",
            author: "",
            date:"",
            postings: [],
            type: "", //板块类型
        }
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    async deletePost() {
        let formData = new FormData();
        formData.append('postingID', this.state.id);
        formData.append('Authorization', cookie.load('token'));
        let ret = (await axios.post('/api/deleteposting', formData)).data;
        let state = ret.state;
        //根据返回值进行处理
        if (state == true) {
            window.location.reload();//直接打开新网页
        }
        else {
            let message = ret.message;
        }
        alert(ret.message);
    }

    async submit() {
        let formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('content', this.state.content);
        formData.append('postingID', this.state.id);
        formData.append('Authorization', this.state.token);
        ////调用后端api,并存储返回值
        let ret = (await axios.post('/api/modifyposting', formData)).data;
        let state = ret.state;
        //根据返回值进行处理
        if (state == true) {
            window.location.reload()//直接打开新网页
        }
        else {
            let message = ret.message;
            alert(message);
        }
    }

    //实时更新state里面的值
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    checkTitle(rule, value, callback) {//待定
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
        }
        callback();
    }
    checkContent(rule, value, callback) {//待定
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
        }
        callback();
    }

    componentDidMount() {
        let token = cookie.load("token")
        let formData = new FormData()
        formData.append('postingID', id())
        formData.append('Authorization', token)
        axios.post("/api/postings/" + id(), formData)
            .then(response => {
                const data = response.data
                this.setState({
                    token: token,
                    title: data.title,
                    content: data.content,
                    author: data.author
                });
                cookie.save("token", this.state.token)
            })

    }

    render() {
        this.state.id = id();
        this.state.token = cookie.load("token");
        if (this.state.token) {
            return (
                <Layout className="layout">
                    <PageHeader style={{ padding: '30px 50px' }}>
                        <h2>编辑帖子</h2>
                    </PageHeader>
                    <div>
                        <div>
                            <Layout className="layout">
                                <Content>
                                    <Form
                                        name="basic"
                                        initialValues={{ remember: true }}
                                    >
                                        <Form.Item
                                            name="title"
                                            rules={[{
                                                required: true, message: '请输入标题!'
                                            }, {
                                                validator: this.checkTitle.bind(this)
                                            }
                                            ]}
                                        >
                                            <textarea defaultValue={this.state.title}
                                                style={{ width: "80%", height: "30px", marginLeft: '50px', marginTop: '10px', textIndent: "8px" }}
                                                type="text" name="title" onChange={this.handleChange} />
                                        </Form.Item>
                                        <Form.Item
                                            name="content"
                                            rules={[{
                                                required: true, message: '请输入正文!'
                                            }, {
                                                validator: this.checkContent.bind(this)
                                            }
                                            ]}
                                        >
                                            <textarea defaultValue={this.state.content}
                                                style={{ width: "80%", height: "300px", marginLeft: '50px', textIndent: "8px" }}
                                                type="text" name="content" onChange={this.handleChange} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" style={{ float: 'left', marginLeft: 50 }}
                                                onClick={this.submit}>
                                                <Link to={"/post/" + this.state.id}>
                                                发送
                                                </Link>
                                            </Button>
                                            <Button style={{ marginLeft: 20 }}>
                                                <Link to="/myPosts">
                                                返回
                                                </Link>
                                            </Button>
                                            <Button id="deletePost" htmlType="submit" style={{ float: 'right', marginRight: "15%"}}
                                                onClick={this.deletePost}>
                                                <Link to="/myPosts">
                                                删除
                                                </Link>
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Content>
                            </Layout>
                        </div>
                    </div>

                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            );
        }
        else {
            return (
                <Layout className="layout">
                    <br /><br /><br />
                    <h1 align="center">
                        请先登录！
                    </h1>
                </Layout>
            );
        }
    }
}

function id() {
    var url = window.location.href;
    var content = url.split("/");
    if (content.length < 5)
        return 0;
    else {
        return content[4];
    }
}