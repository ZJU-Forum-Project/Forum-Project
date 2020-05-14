import {Button, Comment, Descriptions, Form, Input, List, message, Modal, Spin, Avatar, Progress} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';
import InfiniteScroll from 'react-infinite-scroller';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import React from 'react';
import moment from 'moment';
//import "./config"

const {TextArea} = Input;
const Editor = ({onChange, onSubmit, submitting, value}) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value}/>
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
            replyUI: "",
            author: "",
            time: "", //帖子创建时间
            replyList: [],
            value: "",
            submitting: false,
            comments: [],
            name: name,
            re_Author: true, //回复楼主标记
            loading: false,
            hasMore: true,
            data: [],
            eVisible: false,
            dVisible: false,
            rVisible: false,
            floorId: "",
            floorUI: ""
        }

        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('postingID', id());
        formData.append('Authorization', token);
        axios.post("/api/postings/" + id(), formData)
            .then(response => {
                const data = response.data;
                console.log(data);
                this.setState({
                    token: token,
                    title: data.title,
                    author: data.author,
                    time: data.time,
                    content: data.content,
                    replyList: data.replyList,
                });
                cookie.save("token", this.state.token)
            })
    }

    async handleSubmit() {
        let ret = null;
        if (!this.state.value) {
            this.setState({
                submitting: false,
            });
            return;
        }
        this.setState({
            submitting: true,
        });

        let formData = new FormData();
        formData.append('author', this.state.name);
        formData.append('Authorization', this.state.token);
        formData.append('postId', id());
        console.log(this.state.token);
        console.log(this.state.author);

        if (this.state.re_Author == true) {
            formData.append('content', this.state.value);
            ret = (await axios.post('/api/ReplyPosting', formData)).data;
            let state = ret.state;
            //根据返回值进行处理
            if (state == true) {
                window.location.reload()//直接打开新网页
            } else {
                let message = ret.message;
                alert(message);
            }
        } else {
            formData.append('content', "回复第" + this.state.replyUI + "楼：" + this.state.value);
            formData.append("floorId", this.state.replyId);
            ret = (await axios.post('/api/GetFloor', formData)).data;
            let state = ret.state;
            //根据返回值进行处理
            if (state == true) {
                formData.append('replyId', this.state.floorId);
                formData.append('replyUI', ret.replyUI);

                ret = (await axios.post('/api/ReplyFloor', formData)).data;
                let state = ret.state;
                //根据返回值进行处理
                if (state == true) {
                    window.location.reload()//直接打开新网页
                } else {
                    let message = ret.message;
                    alert(message);
                }
            } else {
                let message = ret.message;
                alert(message);
            }
        }

        this.setState({
            submitting: false,
            re_Author: true
        });

    };

    handleReply(event) {
        this.setState({
            re_Author: false,
            replyId: event.target.getAttribute("data-floorId"),
            replyUI: event.target.getAttribute("data-floorUI"),
            rVisible: true
        })
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
        });
    };

    handleInfiniteOnLoad() {
        let {data} = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > this.state.replyList.length) {
            message.warning('Infinite List loaded all');
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

    async handleEdit(event) {
        let formData = new FormData();
        formData.append("Authorization", this.state.token);
        this.setState({
            floorId: event.target.getAttribute("data-floorId")
        });
        console.log(this.state.floorId);
        formData.append("floorId", this.state.floorId);
        let ret = (await axios.post('/api/GetFloor', formData)).data;
        let state = ret.state;
        if (state == true) {
            console.log(ret.content)
            this.setState({
                content: ret.content,
                value: ret.content,
                replyId: ret.replyId,
                replyUI: ret.replyUI,
                eVisible: true
            })
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    async handleEditOk() {
        let formData = new FormData();
        formData.append("floorId", this.state.floorId);
        formData.append('Authorization', this.state.token);
        if (this.state.replyId != 0) {
            formData.append("content", "回复" + this.state.replyUI + "楼：" + this.state.value);
        }
        else{
            formData.append("content", this.state.value);
            console.log(this.state.value)
        }
        formData.append("replyId", this.state.replyId);

        let ret = (await axios.post('/api/ModifyFloor', formData)).data;
        let state = ret.state;

        if (state == true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }

        this.setState({
            eVisible: false,
        });
    }

    async handleDelete(event) {
        this.setState({
            dVisible: true,
            floorId: event.target.getAttribute("data-floorId")
        })
    }

    async handleDeleteOk() {
        let formData = new FormData();
        this.setState({
            dVisible: false
        });
        formData.append("floorId", this.state.floorId);
        formData.append('Authorization', this.state.token);

        let ret = (await axios.post('/api/DeleteReply', formData)).data;
        let state = ret.state;

        if (state == true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    handleECancel() {
        this.setState({
            eVisible: false,
        });
    };

    handleDCancel() {
        this.setState({
            dVisible: false,
        });
    };

    handleRCancel() {
        this.setState({
            rVisible: false,
        });
    };

    is_Current_User(item){
        console.log(item);
        if(this.state.name != item.author){
            let actions = [<span key="comment-basic-reply-to" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleReply.bind(this)}>Reply to</span>]
            return actions
        }
        else{
            let actions = [<span key="comment-basic-reply-to" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                 onClick={this.handleReply.bind(this)}>Reply to</span>,
                            <span key="comment-basic-edit" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleEdit.bind(this)}>Edit</span>,
                            <span key="comment-basic-delete" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleDelete.bind(this)}>Delete</span>]
            return actions
        }
    }

    render() {
        this.state.id = id();
        this.state.token = cookie.load("token");
        if (this.state.token) {
            return (
                <div>
                    <div className="description-title">
                        <Descriptions title={this.state.title}>
                            <Descriptions.Item label="创建时间:">{this.state.time}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="demo-infinite-container">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={this.handleInfiniteOnLoad}
                            hasMore={!this.state.loading && this.state.hasMore}
                            useWindow={false}
                        >
                            <List
                                dataSource={this.state.replyList}
                                renderItem={item => (
                                <List.Item>
                                    <Comment
                                        avatar={
                                            <Avatar
                                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                alt="Han Solo"
                                            />
                                        }
                                        actions={this.is_Current_User(item)}
                                        author={item.author}
                                        content={item.content}
                                        datetime={item.time}
                                    />
                                    <Progress
                                        type="circle"
                                        format={() => `${item.floorUI} 楼`}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        percent={100}
                                        width={50}
                                    />
                                </List.Item>
                                )}
                            >
                                {this.state.loading && this.state.hasMore && (
                                    <div className="demo-loading-container">
                                        <Spin/>
                                    </div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                    <Modal
                        title="Edit"
                        visible={this.state.rVisible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleRCancel.bind(this)}
                    >
                        <p>回复{this.state.replyUI}楼:</p>
                        <textarea placeholder="正文"
                                  style={{
                                      width: "100%",
                                      height: "300px",
                                      textIndent: "8px"
                                  }}
                                  type="text" name="content" onChange={this.handleChange}/>
                    </Modal>
                    <Modal
                        title="Edit"
                        visible={this.state.eVisible}
                        onOk={this.handleEditOk.bind(this)}
                        onCancel={this.handleECancel.bind(this)}
                    >
                        <p>回复{this.state.replyUI}楼:</p>
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
                        onOk={this.handleDeleteOk.bind(this)}
                        onCancel={this.handleDCancel.bind(this)}
                    >
                        <p>是否确认删除该回复？</p>
                    </Modal>
                    <div className="edit-style">
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            submitting={this.state.submitting}
                            value={this.state.value}
                        />
                    </div>
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