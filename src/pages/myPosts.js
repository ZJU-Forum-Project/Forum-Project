import {Avatar, Breadcrumb, Button, Layout, List} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import {Link} from "react-router-dom";
import NotLogin from "../components/notlogin";
import './config';

const {Content} = Layout;
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

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
                <Layout className="layout">
                    <Content style={{padding: '0 50px', backgroundColor: '#ffffff', paddingBottom: '20px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>我的帖子</Breadcrumb.Item>
                        </Breadcrumb>
                        <List
                            pagination={{
                                onChange: page => {
                                    console.log(page);
                                },
                                pageSize: 6,
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
                                        title={[<div><a href={'/post/' + item.id}>{item.title}</a></div>]}
                                        description={<div>{item.content}</div>}
                                    />
                                </List.Item>
                            )}
                        />
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
