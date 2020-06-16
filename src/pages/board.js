import {Divider, Avatar, Button, Form, Input, List, Modal, Descriptions} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import './config';

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
            introduction: "",
            edit_intro_visible: false,
            delete_visible: false,
            id: "",//删除的帖子id
            boardId: "",//版面id
            value: "",
        };

        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('Authorization', token);
        axios.post(global.constants.url + "/api/board/" + type(), formData)
            .then(response => {
                let data = response.data
                let posts = data.postings
                let intro = data.intro
                this.setState({
                    postings: posts,
                    token: token,
                    type: type(),
                    introduction: intro
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
    async handleDisplay() {
        let formData = new FormData();
        formData.append('Authorization', this.state.token);
        let ret = (await axios.post('/api/checkIfBannedByAuthorization', formData)).data;
        let state = ret.state;

        if (state == true) {
            let message = "你已被管理员禁言";
            alert(message);
        } else {
            this.setState({
                display_name: true,
            })
        }
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
            display_name: false
        });
        formData.append('title', this.state.title);
        formData.append('content', this.state.content);
        formData.append('type', postType(this.state.type));
        formData.append('Authorization', this.state.token);
        ////调用后端api,并存储返回值
        let ret = (await axios.post(global.constants.url + '/api/post', formData)).data;
        let state = ret.state;
        //根据返回值进行处理
        if (state === true) {
            window.location.reload()//刷新
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    async handleECancel(event) {
        this.setState(
            {
                edit_intro_visible: false,
            }
        );
    }

    async handleEdit(event) {
        this.setState({
            edit_intro_visible: true,
        })
    }

    async handleEditOk() {
        let formData = new FormData();
        formData.append('Authorization', this.state.token);
        formData.append('boardId', this.state.boardId);
        formData.append('introduction', this.state.introduction);
        let ret = (await axios.post('/api/board/boardmodify', formData)).data;
        let state = ret.state;

        if (state == true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }

        this.setState({
            edit_intro_visible: false,
        });
    }

    async handleDelete(event) {
        this.setState({
            delete_visible: true,
            id: event.target.getAttribute("data-id")
        })
    }

    async handleDeleteOk() {
        let formData = new FormData();
        this.setState({
            delete_visible: false
        });
        formData.append('Authorization', this.state.token);
        formData.append('postingID', this.state.id);

        let ret = (await axios.post('/api/deleteposting', formData)).data;
        let state = ret.state;
        if (state == true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    async is_Admin(item) {
        let formData = new FormData();
        formData.append('Authorization', this.state.token);
        let ret = (await axios.post('/api/isAdmin', formData)).data;
        let message = ret.message;
        if (message == 1) {
            let actions = [<Button id="deletePost" htmlType="submit" style={{float: 'right', marginRight: "15%"}}
                                   data-id={item.id}
                                   onClick={this.handleDelete}>
                删除
            </Button>, <div>{item.time}</div>]
            return actions
        } else {
            let actions = [<div>{item.time}</div>]
            return actions
        }
    }

    async is_Admin_edit() {
        let formData = new FormData();
        formData.append('Authorization', this.state.token);
        let ret = (await axios.post('/api/isAdmin', formData)).data;
        let message = ret.message;
        if (message == 1) {
            let actions = [<Button type="primary" id="modifyIntro" className="headline"
                                   style={{position: "relative", bottom: "60px"}}
                                   onClick={this.handleEdit.bind(this)}>
                修改版面简介
            </Button>]
            return actions
        }
    }

    render() {
        this.state.type = type()
        this.state.boardId = postType(this.state.type)
        if (cookie.load("token")) {
            return (
                <div>
                    <div className="description-title">
                        <Descriptions title={title(this.state.type)}>
                            <Descriptions.Item label="版面简介：">{this.state.introduction}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Button type="primary" id="modifyIntro" className="headline"
                            style={{position: "relative", bottom: "40px"}}
                            onClick={this.handleEdit.bind(this)}>
                        修改版面简介
                    </Button>
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
                    <Modal
                        title="Edit"
                        visible={this.state.edit_intro_visible}
                        onOk={this.handleEditOk.bind(this)}
                        onCancel={this.handleECancel.bind(this)}
                    >
                        <p>修改版面简介:</p>
                        <textarea placeholder="版面简介"
                                  style={{
                                      width: "100%",
                                      height: "300px",
                                      textIndent: "8px"
                                  }}
                                  type="text" name="introduction" onChange={this.handleChange}/>
                    </Modal>
                    <List
                        style={{marginRight:"30px", marginLeft:"30px"}}
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 4,
                        }}
                        itemLayout="horizontal"
                        dataSource={this.state.postings}
                        renderItem={item => (
                            <List.Item actions={this.is_Admin(item)}>
                                <List.Item.Meta
                                    avatar={<Avatar
                                        src={"https://www.zjuse2017.club/" + item.avatarUrl}
                                        onClick={()=>{window.location.href="https://www.zjuse2017.club/otherinfo/" + item.author}}/>}
                                    title={[<div><a href={'/post/' + item.id}>{item.title}</a></div>]}
                                    description={<div>{item.content}</div>}
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
            return 1;
        else if (type === "information")
            return 2;
        else if (type === "intern")
            return 3;
        else if (type === "study")
            return 4;
    }
}
