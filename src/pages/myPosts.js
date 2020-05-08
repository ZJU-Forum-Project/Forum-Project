import {Avatar, Button, Form, List, PageHeader} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import NotLogin from "../components/notlogin";


export default class myPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "", //验证
            display_name: 'none',//发帖区域显示状态
            notdisplay_name: 'block',//按钮显示状态
            date: "",
            postings: [],
            type: "", //板块类型
            title: "",
            content: "",
            id: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    componentDidMount() {
        let token = cookie.load("token")
        let formData = new FormData()
        formData.append('Authorization', token)
        axios.post("/api/personalposting", formData)
            .then(response => {
                const data = response.data
                const posts = data.postings
                this.setState({
                    postings: posts,
                    token: token
                });
            })

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
        } else {
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
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    //实时更新state里面的值
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async display_name() { //编辑按钮的单击事件，修改状态机display_name的取值
        if (this.state.display_name == 'none') {
            this.setState({
                display_name: 'block',
                notdisplay_name: 'none'
            })
        } else if (this.state.display_name == 'block') {
            this.setState({
                display_name: 'none',
                notdisplay_name: 'block',
            })
        }
        //获取id对应帖子的内容存入state
        let formData = new FormData()
        formData.append('postingID', this.state.id)
        formData.append('Authorization', this.state.token)
        axios.post("/api/postings/" + this.state.id, formData)
            .then(response => {
                const data = response.data
                this.setState({
                    token: this.state.token,
                    title: data.title,
                    content: data.content,
                    author: data.author
                })
            })
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

    render() {
        this.state.token = cookie.load("token");
        this.handleChange = this.handleChange.bind(this);
        if (this.state.token) {
            return (
                <div>
                    <PageHeader style={{padding: '20px 50px'}} title="我的贴子"/>
                    <div style={{display: this.state.display_name}}>
                        <h3>修改帖子</h3>

                        <Form name="basic" initialValues={{remember: true}}>
                            <Form.Item name="title" rules={[{
                                required: true,
                                message: '请输入标题!'
                            }, {validator: this.checkTitle.bind(this)}]}>
                                            <textarea defaultValue={this.state.title}
                                                      style={{
                                                          width: "80%",
                                                          marginLeft: '50px',
                                                          marginTop: '10px',
                                                          height: '30px'
                                                      }}
                                                      type="text" name="title" onChange={this.handleChange}/>
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
                                                      style={{
                                                          width: "80%",
                                                          height: "300px",
                                                          marginLeft: '50px',
                                                          textIndent: "8px"
                                                      }}
                                                      type="text" name="content" onChange={this.handleChange}/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit"
                                        style={{float: 'left', marginLeft: 50}} onClick={this.submit}>
                                    确定
                                </Button>
                                <Button id="cancel" style={{float: 'left', marginLeft: 10}}
                                        onClick={this.display_name.bind(this)}>
                                    取消
                                </Button>
                                <Button id="hide" style={{float: 'left', marginLeft: 10}}
                                        onClick={this.display_name.bind(this)}>
                                    隐藏
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div>
                        <List
                            pagination={{
                                onChange: page => {
                                    console.log(page);
                                },
                                pageSize: 4,
                            }}
                            itemLayout="horizontal"
                            dataSource={this.state.postings}
                            renderItem={item => (
                                <List.Item actions={[<div>{item.time}</div>,
                                    <Button id="deletePost" htmlType="submit"
                                            onClick={this.state.id = item.id,this.deletePost}>
                                        删除
                                    </Button>,
                                    <Button type="primary" htmlType="submit" id="mdfPost" style={{marginLeft: 10}}
                                            onClick={this.state.id = item.id,this.display_name.bind(this)}>
                                        修改
                                    </Button>]
                                }>
                                    <List.Item.Meta
                                        avatar={<Avatar
                                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                        title={[<div><a href={'/post/' + item.id}>{item.title}</a></div>]}
                                        description={<div>description</div>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }
}
