import {Avatar, Button, Form, Input, List, PageHeader, Modal} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import boardImg1 from '../img/board-1.jpeg';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "", //验证
            display_name: false,//发帖区域显示状态
            notdisplay_name: 'block',//按钮显示状态
            title: "",
            content: "",
            postings: [],
            type: "",
        };
        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit()
        // this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('Authorization', token);
        axios.post("/api/board/" + type(), formData)
            .then(response => {
                let data = response.data
                let posts = data.postings
                this.setState({
                    postings: posts,
                    token: token,
                    type: type()
                });
            })

    }


    //实时更新state里面的值
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
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

    // 显示对话框
    handleDisplay() {
        this.setState({
            display_name: true,
        })
    }

    // 关闭对话框
    handleCancel = () => {
        this.setState({
            display_name: false,
        });
    };

    async handleSubmit() {
        let formData = new FormData();
        this.setState({
            display_name: false,
        });
        formData.append('title', this.state.title);
        formData.append('content', this.state.content);
        formData.append('type', postType(this.state.type));
        formData.append('Authorization', this.state.token);
        ////调用后端api,并存储返回值
        let ret = (await axios.post('/api/post', formData)).data;
        let state = ret.state;
        //根据返回值进行处理
        if (state === true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    render() {
        // this.state.token = cookie.load("token");
        this.state.token = true;
        this.state.type = type();
        if (this.state.token) {
            return (
                <div>
                    <Avatar className="headline" shape="square" size={128}
                            src={boardImg1}/>
                    <Button className="headline" type="dashed"
                            style={{position: "relative", bottom: "40px"}}>{title(this.state.type)}</Button>
                    <Button type="primary" id="createPost" className="headline"
                            style={{position: "relative", bottom: "40px"}}
                            onClick={this.handleDisplay.bind(this)}>
                        发表帖子
                    </Button>
                    <Modal title="" visible={this.state.display_name} onCancel={this.handleCancel}
                           onOk={this.handleSubmit}>
                        <h3>新建帖子</h3>
                        <div>
                            <Form
                                name="basic"
                                initialValues={{remember: true}}
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
                                    <Input placeholder="标题"
                                           type="text" name="title" onChange={this.handleChange}/>
                                </Form.Item>
                                <Form.Item name="content"
                                           rules={[{required: true, message: '请输入正文!'},
                                               {validator: this.checkContent.bind(this)}]}>
                                    <textarea placeholder="正文"
                                              style={{
                                                  width: "100%",
                                                  height: "300px",
                                                  textIndent: "8px"
                                              }}
                                              type="text" name="content" onChange={this.handleChange}/>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>

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
                            <List.Item actions={[<div>{item.time}</div>]}>
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
            );
        } else {
            return (
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }

}

function type() {
    var url = window.location.href;
    var content = url.split("/");
    if (content.length < 5)
        return "study";
    else {
        return content[4];
    }
}

function title(type) {
    if (type == null)
        return "板块信息";
    else {
        if (type === "emotion")
            return "情感交流";
        else if (type === "information")
            return "校园生活";
        else if (type === "intern")
            return "实习信息";
        else if (type === "study")
            return "学习资料";
    }
}

function postType(type) {
    if (type == null)
        return 1;
    else {
        if (type === "emotion")
            return 2;
        else if (type === "information")
            return 3;
        else if (type === "intern")
            return 4;
        else if (type === "study")
            return 1;
    }
}
