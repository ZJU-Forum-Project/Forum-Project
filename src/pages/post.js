import {Layout,  Breadcrumb, PageHeader, Card} from 'antd';
import NavigateBar from '../components/navigate';
import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import "../asset/board.css"


const { Header, Footer, Sider, Content } = Layout;
let posting = {
    title:"title", content:"content", id:1, user:"user"
}

export default class Post extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id : "", //帖子id
            token : "", //验证
        }
    }
    render() {
        this.state.id = id();
        let formData = new FormData();
        formData.append('token', this.state.token);
        formData.append('postingID', this.state.id);
        if(this.state.id==0) {
            let postingTemp = [];
        }
        else {
            let postingTemp = axios.post("/api/postings/"+this.state.id);
        }
        return(
            <Layout className="layout">
                <NavigateBar />
                <PageHeader style={{padding: '30px 50px'}}>
                <div>
                    <Card title={posting.title} >
                        <p style={{fontSize: '10px'}}>{posting.user}</p>
                    </Card>
                </div>
                </PageHeader>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">{posting.content}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        );
    }
    
}

function id(){
    var url = window.location.href;
    var content = url.split("/");
    if(content.length<5)
        return 0;
    else {
        return content[4];
    }
}