import {Layout,  Breadcrumb, PageHeader, Avatar, icons, List, Alert, notification} from 'antd';
import NavigateBar from '../components/navigate';
import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import "../asset/board.css"


const { Header, Footer, Sider, Content } = Layout;
let posts = [
    {title:"qwe", content:"zheshiyige", id:1},
    {title:"qwer", content:"zheshiyigeqwe", id:2},
    {title:"qwert", content:"zheshiyigeqwertr", id:3},
    {title:"qwetyu", content:"zheshiyigeasdsfsf", id:4},
    {title:"qwetyui", content:"zheshiyigeasdsfsfzxc", id:5}
]
export default class Board extends React.Component {
    render() {
        var url = window.location.href;
        var content = url.split("/");
    
        return(
            <Layout className="layout">
                <NavigateBar />
                <PageHeader style={{padding: '20px 50px'}} title="**板块"/>
                <Content style={{padding: '0px 50px'}}>   
                    <List
                        pagination={{
                        onChange: page => {
                          console.log(page);
                        },
                        pageSize: 3,
                        }}
                        itemLayout="horizontal"
                        dataSource={posts}
                        renderItem={item => (
                        <List.Item actions={[<a href={'/post/'+item.id}>detail</a>]}>
                            <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={<div>{item.title}</div>}
                            description={<div>description</div>}
                            />
                        </List.Item>
                        )}
                    />
                </Content>
                <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
            </Layout>
      );
    }
    
}
