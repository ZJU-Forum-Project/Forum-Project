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
            title:"",
            content:"",
            author:""
        }
    }
    componentDidMount(){
        let token = cookie.load("token")
        let formData = new FormData()
        formData.append('postingID',id())
        formData.append('Authorization',token)
        axios.post("/api/postings/"+id(), formData)
            .then(response=>{
                const data = response.data
                this.setState({
                    token: token,
                    title:data.title,
                    content:data.content,
                    author:data.author
                });
                cookie.save("token", this.state.token)
        })
        
    }
    render() {
        this.state.id = id();
        this.state.token=cookie.load("token");
        if(this.state.token){
            return(
                <Layout className="layout">
                    <NavigateBar />
                    <PageHeader style={{padding: '30px 50px'}}>
                    <div>
                        <Card title={this.state.title} >
                            <p style={{fontSize: '10px'}}>{this.state.author}</p>
                        </Card>
                    </div>
                    </PageHeader>
                    <Content style={{ padding: '0 50px' }}>
                        <div className="site-layout-content">{this.state.content}</div>
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