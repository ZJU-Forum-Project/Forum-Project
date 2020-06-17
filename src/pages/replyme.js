import {Avatar, Breadcrumb, Button, Comment, Layout, List} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import {Link} from "react-router-dom";
import './config';

const {Content} = Layout;
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

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
        let formData = new FormData();
        formData.append('Authorization', token);
        axios.post(global.constants.url + "/api/CheckReply", formData)
            .then(response => {
                const replies = response.data.replies;
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
        element.setAttribute("style", "backgroundColor:#ffffff");
        formData.append('Authorization', token);
        formData.append('id', id);
        axios.post(global.constants.url + "/api/seenReply", formData);
    };


    render() {
        this.state.token = cookie.load("token");
        this.handleChange = this.handleChange.bind(this);
        if (this.state.token) {
            return (
                <Layout className="layout">
                    <Content style={{padding: '0 50px', backgroundColor: '#ffffff', paddingBottom: '20px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>回复我的</Breadcrumb.Item>
                        </Breadcrumb>
                        <List
                            pagination={{
                                onChange: page => {
                                    console.log(page);
                                },
                                pageSize: 6,
                            }}
                            header={<div>{this.state.reply ? this.state.reply.length + "回复" : "当前没有回复"}</div>}
                            itemLayout="horizontal"
                            dataSource={this.state.reply}
                            renderItem={item => (
                                <List.Item actions={[<div>{item.replyTime}</div>]}
                                           id={item.id}
                                           onClick={this.hasAlreadyRead.bind(this, item.id)}
                                           style={{backgroundColor: Boolean(item.replyState) ? "#ffffff" : "#40a9ff"}}
                                >
                                    <List.Item.Meta
                                        title={[<div>
                                                    <a
                                                       href={"/post/" + Number(item.postId)}>{item.postName}:{item.author}在第{item.floorNumber}楼回复了你
                                                    </a>
                                                </div>]}
                                        avatar={<Avatar
                                            src={"https://www.zjuse2017.club/" + item.avatarUrl}
                                            onClick={()=>{window.location.href="https://www.zjuse2017.club/otherinfo/" + item.author}}/>}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                        {/*<List*/}
                        {/*    className="comment-list"*/}
                        {/*    header={<div*/}
                        {/*        className="headline">{this.state.reply ? this.state.reply.length + "回复" : "当前没有回复"}</div>}*/}
                        {/*    itemLayout="horizontal"*/}
                        {/*    dataSource={this.state.reply}*/}
                        {/*    renderItem={item => (*/}
                        {/*        <li id={item.id} onClick={this.hasAlreadyRead.bind(this, item.id)}*/}
                        {/*            style={{backgroundColor: Boolean(item.replyState) ? "#ffffff" : "#fafafa"}}>*/}
                        {/*            <Comment*/}
                        {/*                actions={[<Link to={"/post/" + Number(item.postId)}>{item.postName}</Link>]}*/}
                        {/*                author={[<div>{item.author}在第{item.floorNumber}楼回复了你</div>]}*/}
                        {/*                avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'*/}
                        {/*                content={item.content}*/}
                        {/*                datetime={item.replyTime}*/}
                        {/*            />*/}
                        {/*        </li>*/}
                        {/*    )}*/}
                        {/*/>*/}
                    </Content>
                </Layout>
            );
        } else {
            return (
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }
}


