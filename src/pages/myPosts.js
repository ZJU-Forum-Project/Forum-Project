import {Avatar, Button, List} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import {Link} from "react-router-dom";
import NotLogin from "../components/notlogin";
import './config';

export default class myPosts extends React.Component {
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
        let token = cookie.load("token")
        let formData = new FormData()
        formData.append('Authorization', token)
        axios.post(global.constants.url + "/api/personalposting", formData)
            .then(response => {
                const data = response.data;
                const posts = data.postings;
                this.setState({
                    postings: posts,
                    token: token
                });
            })
    }

    render() {
        this.state.token = cookie.load("token");
        this.handleChange = this.handleChange.bind(this);
        if (this.state.token) {
            return (
                <div>
                    <h1 className="headline">我的贴子</h1>
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
                                <Button>
                                    <Link to={"/mdpo/" + item.id}>
                                        编辑
                                    </Link>
                                </Button>]}>
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
