import {Comment, Tooltip, Avatar, Descriptions, List, Button, Input, Form, Badge, Spin, Modal} from 'antd';
import NavigateBar from '../components/navigate';
import axios from 'axios';
import cookie from 'react-cookies';
import InfiniteScroll from 'react-infinite-scroller';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import React, { createElement, useState } from 'react';
import moment from 'moment';

const { TextArea } = Input;
const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        let name = cookie.load("name");
        this.state = {
            id: "", //帖子id
            token: "", //验证
            title: "",
            content: "",
            replyId: "",
            author: "",
            time: "", //帖子创建时间
            replyList: [],
            value: "",
            submitting: false,
            comments:[],
            name: name,
            re_Author: true, //回复楼主标记
            loading: false,
            hasMore: true,
            data: [],
            eVisible: false,
            dVisible: false,
            floorId: ""
        }

        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReply = this.handleReply(this);
        this.handleEdit = this.handleEdit(this);
        this.handleDelete = this.handleDelete(this);
        this.handleEditOk = this.handleEditOk(this);
        this.handleDeleteOk = this.handleDeleteOk(this);
    }

    componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('postingID', id());
        formData.append('Authorization', token);
        axios.post("/api/postings/" + id(), formData)
            .then(response => {
                const data = response.data;
                this.setState({
                    token: token,
                    title: data.title,
                    content: data.content,
                    author: data.author,
                    time: data.time,
                    replyList: data.replyList
                });
                cookie.save("token", this.state.token)
            })

    }

    async handleSubmit (){
        let ret = null;
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        let formData = new FormData();
        formData.append('author', this.state.name);
        formData.append('content', this.state.value);
        formData.append('Authorization', this.state.token);
        formData.append('time', moment().fromNow());
        console.log(this.state.token);
        console.log(this.state.author);
        console.log(this.state.content);

        if(this.state.re_Author == true) {
            ret = (await axios.post('/api/ReplyPosting', formData)).data;
        }
        else {
            formData.append('floor', this.state.floor);
            ret = (await axios.post('/api/ReplyFloor', formData)).data;
        }
        let state = ret.state;
        //根据返回值进行处理
        if (state === true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    };

    handleReply(event){
        this.setState({
            value: "Reply Floor" + event.target.value + ":",
            re_Author : false,
            floorId: event.target.value
        })
    }

    handleChange(event){
        this.setState({
            value: event.target.value,
        });
    };

    handleInfiniteOnLoad(){
        let { data } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > this.state.replyList.length) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }

        data = data.concat(this.state.replyList);
        this.setState({
            data,
            loading: false,
        });
    }

    async handleEdit(event){
        console.log(event.target.value);
        this.setState({
            floorId: event.target.value
        })
        let ret = (await axios.get('/api/GetFloorContent/' + this.state.floorId)).data;
        let state = ret.state;
        if (state === true) {
            let content = ret.message.split(";")[1];
            let replyId = ret.message.split(";")[2];
            this.setState({
                content: content,
                eVisible: true
            })
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    async handleEditOk(event){
        console.log(event.target.value);
        let formData = new FormData();
        formData.append("floorId",this.state.floorId);
        formData.append("content","回复" + this.state.floorId + "楼：" + this.state.content);
        formData.append("replyId",this.state.replyId);

        let ret = (await axios.post('/api/ModifyFloor', formData)).data;
        let state = ret.state;

        if (state === true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    async handleDelete(event){
        this.setState({
            dVisible: true,
            floorId: event.target.value
        })
    }

    async handleDeleteOk(){
        let formData = new FormData();
        formData.append("floorId",this.state.floorId);

        let ret = (await axios.post('/api/DeleteReply', formData)).data;
        let state = ret.state;

        if (state === true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    handleECancel(event){
        console.log(event);
        this.setState({
            eVisible: false,
        });
    };

    handleDCancel(event){
        console.log(event);
        this.setState({
            dVisible: false,
        });
    };

    render() {
        const actions = [
            <span key="comment-basic-reply-to">Reply to</span>,
        ];

        this.state.id = id();
        this.state.token = cookie.load("token");
        if (this.state.token) {
            return (
                <div>
                    <Descriptions title={this.state.title}>
                        <Descriptions.Item label="创建时间:">{this.state.time}</Descriptions.Item>
                    </Descriptions>
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        loadMore={this.handleInfiniteOnLoad}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                    >
                        <List
                            className="comment-list"
                            header={`${this.state.replyList.length} replies`}
                            itemLayout="horizontal"
                            dataSource={this.state.replyList}
                            renderItem={item => (
                                <li>
                                    ({this.state.name} != {item.author})?
                                    <badge count={item.floor}>
                                        <Comment
                                            actions={<span value={item.floorId} onClick={this.handleReply}>Reply to</span>}
                                            author={item.author}
                                            content={item.content}
                                            datetime={item.datetime}
                                        />
                                    </badge>
                                    :<badge count={item.floor}>
                                    <Comment
                                        actions={[<span value={item.floorId} onClick={this.handleReply}>Reply to</span>,
                                                  <span value={item.floorId} onClick={this.handleEdit}>Edit</span>,
                                                  <span value={item.floorId} onClick={this.handleDelete}>Delete</span>]}
                                        author={item.author}
                                        content={item.content}
                                        datetime={item.datetime}
                                    />
                                    </badge>
                                </li>
                            )}
                        />
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </InfiniteScroll>
                    <Modal
                        title="Edit"
                        visible={this.state.eVisible}
                        onOk={this.handleEditOk}
                        onCancel={this.handleECancel}
                    >
                        <p>回复{this.state.replyId}楼:</p>
                        <textarea placeholder="正文"
                                  style={{
                                      width: "100%",
                                      height: "300px",
                                      textIndent: "8px"
                                  }}
                                  type="text" name="content" onChange={this.handleChange}/>
                    </Modal>
                    <Modal
                        title="Delete"
                        visible={this.state.dVisible}
                        onOk={this.handleDeleteOk}
                        onCancel={this.handleDCancel}
                    >
                        <p>是否确认删除该回复？</p>
                    </Modal>
                    <Editor
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                        submitting={this.state.submitting}
                        value={this.state.value}
                    />
                </div>
            );
        } else {
            return (
                <div style={{fontSize: "100px", float: "center", textAlign: "center"}}><NotLogin/></div>
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
