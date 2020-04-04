import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import {  HomeFilled } from '@ant-design/icons';
import { Input } from 'antd';

const { Search } = Input;
const { Header, Footer,  Content } = Layout;

function NavigateBar() {
    return (
      <Layout className="layout">
      <Header>
        <div className="logo" >
          <a href = "/index.html">
            <HomeFilled twoToneColor />
            {/* <img src="./home.jfif" style={{width: '50px',height: '50px'}} /> */}
            <text>&nbsp;&nbsp;校园论坛</text>
          </a>   
        </div>
        <div className="search">
          <Search placeholder="搜索问题或找人" onSearch={value => console.log(value)} enterButton />
        </div>
        <Menu size="small" theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item className="menuItemStyle" key="1">版面列表</Menu.Item>
          <Menu.Item className="menuItemStyle" key="2">新帖</Menu.Item>
          <Menu.Item className="menuItemStyle" key="3">通知</Menu.Item>
        </Menu>

      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">Content</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
    );
}

export default NavigateBar;

