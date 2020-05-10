import {Card, Layout} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import './config';

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "", //帖子id
            token: "", //验证
            title: "",
            content: "",
            author: ""
        }
    }

    componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('postingID', id());
        formData.append('Authorization', token);
        axios.post(global.constants.url + "/api/postings/" + id(), formData)
            .then(response => {
                const data = response.data;
                this.setState({
                    token: token,
                    title: data.title,
                    content: data.content,
                    author: data.author
                });
                cookie.save("token", this.state.token)
            })

    }

    render() {
        this.state.id = id();
        this.state.token = cookie.load("token");
        if (this.state.token) {
            return (
                <div>
                    <div>
                        <Card title={this.state.title}>
                            <p style={{fontSize: '10px'}}>{this.state.author}</p>
                        </Card>
                    </div>
                    <div className="site-layout-content">{this.state.content}</div>
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
