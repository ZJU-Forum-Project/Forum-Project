import {Layout, PageHeader, Card} from 'antd';
import NavigateBar from '../components/navigate';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import "../asset/board.css"


const {Footer, Content } = Layout;

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
        let postingTemp = (axios.post("/api/postings/"+this.state.id, formData)).data;
        let posting = {};
        if(postingTemp.state) {
            posting = postingTemp;
            cookie.save('token',postingTemp.authorizeToken);
        } else {
            alert(postingTemp.message);
        }
        if(this.state.token){
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <PageHeader style={{padding: '30px 50px'}}>
                    <div>
                        <Card title={posting.title} >
                            <p style={{fontSize: '10px'}}>{posting.author}</p>
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
        else{
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <br/><br/><br/>
                    <h1 align="center">
                        请先登录！
                    </h1>
                </Layout>
            );
        }
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