import {Layout,  Breadcrumb, PageHeader, Card} from 'antd';
import NavigateBar from '../components/navigate';
import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import "../asset/board.css"


const { Header, Footer, Sider, Content } = Layout;
let posts = {
    title:"title", content:"content", id:1, user:"user"
}

export default class Post extends React.Component {
    render() {
        var url = window.location.href;
        var content = url.split("/");
    
        return(
            <Layout className="layout">
                <NavigateBar />
                <PageHeader style={{padding: '30px 50px'}}>
                <div>
                    <Card title={posts.title} >
                        <p style={{fontSize: '10px'}}>{posts.user}</p>
                    </Card>
                </div>
                </PageHeader>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">{posts.content}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        );
    }
    
}
