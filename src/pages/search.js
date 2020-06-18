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
            value: "",
        };

        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        let url = document.URL;
        let searchUrl = url.split("=")[1];
        let searchValue=decodeURI(searchUrl);
        formData.append("content",searchValue);
        formData.append('Authorization', token);
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

    render() {
        if (cookie.load("token")) {
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
                                        src={"https://www.zjuse2017.club/" + item.avatarUrl}/>}
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

