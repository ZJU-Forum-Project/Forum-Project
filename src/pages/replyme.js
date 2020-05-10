import {Comment, List} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import {Link} from "react-router-dom";
import './config';

export default class ReplyMe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "", //验证
            date: "",
            postings: [],
            type: "", //板块类型
            title: "",
            content: "",
            id: "",
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    componentDidMount() {
        let token = cookie.load("token");
        let receiver = cookie.load("name");
        let formData = new FormData();
        formData.append('Authorization', token);
        formData.append('receiver', receiver);
        axios.post(global.constants.url + "/api/CheckReply", formData)
            .then(response => {
                const data = response.data;
                const replies = data.replies;
                this.setState({
                    reply: replies,
                    token: token
                });
            })
    }

    async hasAlreadyRead(id) {
        let token = cookie.load("token");
        let formData = new FormData();
        var element = document.getElementById(id);
        element.setAttribute("style", "background:grey");
        formData.append('Authorization', token);
        formData.append('id', id);
        axios.post(global.constants.url + "/api/seereply", formData);
    };


    render() {
        this.state.token = cookie.load("token");
        this.handleChange = this.handleChange.bind(this);
        if (this.state.token) {
            return (
                <div>
                    <h1 className="headline">回复我的</h1>
                    <List
                        className="comment-list"
                        header={<div
                            className="headline">{this.state.reply ? this.state.reply.length + "回复" : "当前没有回复"}</div>}
                        itemLayout="horizontal"
                        dataSource={this.state.reply}
                        renderItem={item => (
                            <li id={item.id}
                                style={{color: item.state ? "red" : "blue"}}
                                onClick={this.hasAlreadyRead.bind(this, item.id)}>
                                <Comment
                                    actions={[<Link to="/post/{item.postid}">{item.postname}</Link>]}
                                    author={[<div>{item.author}在第{item.floor}回复了你</div>]}
                                    avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                    content={item.content}
                                    datetime={item.datetime}
                                />
                            </li>
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


