import React from 'react';
import '../asset/navigate.css';
import {Avatar, Button, Dropdown, Menu, notification} from 'antd';
import {DownSquareFilled} from '@ant-design/icons';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';


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

const userCenter = (
    <Menu theme="dark">
        <Menu.Item className="menuItemStyle">
            <Link to="/personinfo">
                个人中心
            </Link>
        </Menu.Item>
        <Menu.Item className=" menuItemStyle">
            <Link to="/myPosts">
                我的帖子
            </Link>
        </Menu.Item>
        <Menu.Item className=" menuItemStyle">
            <Link to="/myReplies">
                回复我的
            </Link>
        </Menu.Item>
        <Menu.Item className=" menuItemStyle">
            <Link to="/modifypwd">
                修改密码
            </Link>
        </Menu.Item>
        < Menu.Item
            className="menuItemStyle">
            <Button
                type="link"
                size="large"
                style={{position: "relative", bottom: "10px"}}
                onClick={
                    function () {
                        cookie.remove('name',null);
                        cookie.remove('avatarUrl',null);
                        cookie.remove('token',null);
                        window.location.reload();
                    }
                }> 注销 </Button>
        </Menu.Item>
    </Menu>
);


//右上角登陆，注册界面下拉框实现
const notLogin = (
    <Menu theme="dark">
        <Menu.Item className="menuItemStyle">
            <Link to="/register">
                <Button ghost type="link" style={{fontSize: "medium"}}>用户注册</Button>
            </Link>
        </Menu.Item>
        <Menu.Item className="menuItemStyle">
            <Link to="/login">
                <Button ghost type="link" style={{fontSize: "medium"}}> 普通登陆 </Button>
            </Link>
        </Menu.Item>
        <Menu.Item className="menuItemStyle">
            <a href={loginGithubUrl}><Button ghost type="link" style={{fontSize: "medium"}}>GitHub登录</Button></a>
        </Menu.Item>
    </Menu>
);

const pages = (
    <Menu theme="dark">
        <Menu.Item key="sub1">
            <Button ghost href="/board/emotion" type="link" style={{fontSize: "medium"}}>情感交流</Button>
        </Menu.Item>
        <Menu.Item key="sub2">
            <Button ghost href="/board/information" type="link" style={{fontSize: "medium"}}>校园生活</Button>
        </Menu.Item>
        <Menu.Item key="sub3">
            <Button ghost href="/board/intern" type="link" style={{fontSize: "medium"}}>实习信息</Button>
        </Menu.Item>
        <Menu.Item key="sub4">
            <Button ghost href="/board/study" type="link" style={{fontSize: "medium"}}>学习资料</Button>
        </Menu.Item>
    </Menu>
);

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
            <Menu.Item className="menuItemStyle" key="1">
                <Dropdown overlay={pages}>
                    <a className="menuItemStyle">
                        版面列表<DownSquareFilled/>
                    </a>
                </Dropdown>
            </Menu.Item>;
        if (cookie.load('token') === undefined || cookie.load('token') === null)
            this.loginButton =
                <Menu.Item>
                    <Dropdown overlay={notLogin} className="menuItemStyle">
                        <a className="menuItemStyle">
                            注册/登录<DownSquareFilled/>
                        </a>
                    </Dropdown>
                </Menu.Item>;
        else {
            this.loginButton =
                <Menu.Item>
                    <Dropdown overlay={userCenter} className="menuItemStyle">
                        <a className="menuItemStyle" onClick={e => e.preventDefault()}>
                            {cookie.load('name')}&nbsp;&nbsp;<Avatar shape="square" size={28}
                                                                     style={{position: "relative", bottom: "10px"}}
                                                                     src={cookie.load('avatarUrl')}/>
                        </a>
                    </Dropdown>
                </Menu.Item>;
        }

        return (
            <Menu theme="dark" mode="inline">
                {this.pageButton}
                <Menu.Item className="menuItemStyle" key="2"><a className="menuItemStyle">最新发帖</a></Menu.Item>
                {this.loginButton}
            </Menu>
        );
    }
}

// 我的贴子在userCenter下拉栏
export default NavigateBar;
