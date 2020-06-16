import {Avatar, Button, List} from 'antd';
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
        let searchValue=cookie.load("search");
        formData.append("content",searchValue);
        formData.append('Authorization', token);
        // let data=TestData;
        // let posts = data.postingList;
        // this.setState({
        //       postings: posts,
        //       token: token,
        // })本地测试用，实际使用时删去这段即可
        axios.post(global.constants.url + '/api/search',formData)
             .then(responce=>{
                    let data=responce.data;
                    let posts = data.postings;
                    this.setState({
                        postings: posts,
                        token: token,
                    });
               });

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
        this.state.boardId = postType(this.state.type)
        if (1||cookie.load("token")) {
            return (
                <div>
                    <List
                        style={{marginRight:"30px", marginLeft:"30px"}}
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 5,
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
