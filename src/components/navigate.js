import React from 'react';
import '../asset/navigate.css';
import {Avatar, Button, Dropdown, Menu, notification} from 'antd';
import {DownSquareFilled, AppstoreOutlined, LoginOutlined, AlertOutlined, UserOutlined} from '@ant-design/icons';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
const { SubMenu } = Menu;


const loginGithubUrl = "https://github.com/login/oauth/authorize?client_id=d25125e25fe36054a4de&redirect_uri=http://106.12.27.104/callback&scope=user&state=1";

//上方菜单栏实现
const openNotification = (r) => {
    let replyNumber = r;
    const args = {
        message: "当前有" + Number(replyNumber) + "新消息",
        duration: 0,
    };
    if (replyNumber !== 0)
        notification.open(args);
};

async function ToLogin(urlParam) {
    let code = urlParam.split("&")[0].split("=")[1];
    let state = urlParam.split("&")[1].split("=")[1];
    let formData = new FormData();
    formData.append('code', code);
    formData.append('state', state);

    let person_info = (await axios.post(global.constants.url + '/api/githubLogin', formData)).data;

    let success = person_info.state;
    if (success) {
        let username = person_info.message.split(";")[0];
        let avatar_url = person_info.message.split(";")[1];
        let token = person_info.authorizeToken;
        cookie.save('name', username);
        cookie.save('avatarUrl', avatar_url);
        cookie.save('token', token);
    }
    return person_info;
}

async function getUnreadReplyNumber() {
    let token = cookie.load("token");
    let name = cookie.load("name");
    let formData = new FormData();
    formData.append('Authorization', token);
    formData.append('receiver', name);
    return  (await axios.post(global.constants.url + "/api/getUnreadReplyNumber", formData)).data.num;
};

class NavigateBar extends React.Component {
    componentWillMount() {
        let url = document.URL;
        if (url.search("callback") !== -1) {
            let urlParam = url.split("?")[1];
            ToLogin(urlParam).then(r => this.forceUpdate());
        }

        if(cookie.load('token')){
            getUnreadReplyNumber().then(r => openNotification(r));
        }
    }

    render() {
        this.pageButton =
            <SubMenu
                key="sub1"
                title={
                    <span>
                        <AppstoreOutlined />
                        <span>版面列表</span>
                    </span>
                }
            >
                <Menu.Item key="subsub1" >
                    <a href="/board/emotion" rel="noopener noreferrer">
                        情感交流
                    </a>
                </Menu.Item>
                <Menu.Item key="subsub2">
                    <a href="/board/information" rel="noopener noreferrer">
                        校园生活
                    </a>
                </Menu.Item>
                <Menu.Item key="subsub3">
                    <a href="/board/intern" rel="noopener noreferrer">
                        实习信息
                    </a>
                </Menu.Item>
                <Menu.Item key="subsub4">
                    <a href="/board/study" rel="noopener noreferrer">
                        学习资料
                    </a>
                </Menu.Item>
            </SubMenu>
        if (cookie.load('token') === undefined || cookie.load('token') === null)
            this.loginButton =
                <SubMenu
                    key="sub3"
                    title={
                        <span>
                            <LoginOutlined />
                            <span>登录/注册</span>
                        </span>
                    }
                >
                    <Menu.Item key="subsub5">
                        <a href="/register" rel="noopener noreferrer">
                            用户注册
                        </a>
                    </Menu.Item>
                    <Menu.Item key="subsub6">
                        <a href="/login" rel="noopener noreferrer">
                            用户登录
                        </a>
                    </Menu.Item>
                    <Menu.Item key="subsub7">
                        <a href={loginGithubUrl} rel="noopener noreferrer">
                            GitHub登录
                        </a>
                    </Menu.Item>
                </SubMenu>
        else {
            this.loginButton =
                <SubMenu
                    key="sub3"
                    title={
                        <span>
                            <UserOutlined />
                            <span className="menuItemStyle" onClick={e => e.preventDefault()}>
                            {cookie.load('name')}&nbsp;&nbsp;<Avatar shape="square" size={28}
                                                                     style={{position: "relative", bottom: "10px"}}
                                                                     src={cookie.load('avatarUrl')}/>
                            </span>
                        </span>
                    }
                >
                    <Menu.Item key="subsub5">
                        <a href="/personinfo" rel="noopener noreferrer">
                            个人中心
                        </a>
                    </Menu.Item>
                    <Menu.Item key="subsub6">
                        <a href="/myPosts" rel="noopener noreferrer">
                            我的发贴
                        </a>
                    </Menu.Item>
                    <Menu.Item key="subsub7">
                        <a href="/myReplies" rel="noopener noreferrer">
                            回复我的
                        </a>
                    </Menu.Item>
                    <Menu.Item key="subsub7">
                        <a href="/modifypwd" rel="noopener noreferrer">
                            修改密码
                        </a>
                    </Menu.Item>
                    <Menu.Item className="menuItemStyle">
                        <Button
                            type="link"
                            size="large"
                            style={{position: "relative", bottom: "10px"}}
                            onClick={
                                function clearCookie () {
                                    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                                    if(keys) { for(var i = keys.length - 1;i > -1; i--){
                                        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() +';path=/;domain=https://www.zjuse2017.club/' + document.domain.split('.').slice(-2).join('.')
                                    }
                                    }
                                    window.location.reload();
                                }
                            }> 注销 </Button>
                    </Menu.Item>
                </SubMenu>
        }
        return (
            <Menu theme="light" mode="inline" defaultSelectedKeys={['2']}>
                {this.pageButton}
                <Menu.Item key="sub2">
                    <span>
                        <AlertOutlined />
                        <span>最新发帖</span>
                    </span>
                </Menu.Item>
                {this.loginButton}
            </Menu>
        );
    }
}

// 我的贴子在userCenter下拉栏
export default NavigateBar;
