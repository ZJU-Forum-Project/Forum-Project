import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import HomePage from './pages/homepage';
import Modifypwd from './pages/modifypwd';
import Board from './pages/board';
import post from './pages/post';
import myPosts from './pages/myPosts';
import {Input, Layout} from "antd";
import Text from "antd/es/typography/Text";
import {HomeFilled} from "@ant-design/icons";
import NavigateBar from "./components/navigate";

const {Search} = Input;
const {Header, Content, Footer, Sider} = Layout;

// 将Layout配置为全局布局
// 子界面只需只需实现content内容
// 内容可参考homepage内容

export default class Routing extends React.Component {
    render() {
        return (
            // 所有值应按照百分比形式进行赋值，请不要修改height的值
            <Layout style={{width: "100%", height: "fit-content",minHeight:"500px"}}>
                <Header>
                    <div className="logo">
                        <Text style={{color: '#1890ff', fontSize: "large"}}><HomeFilled
                            twoToneColor/>DD98</Text>
                    </div>
                    <div className="search">
                        <Search placeholder="搜索问题或找人" onSearch={value => console.log(value)} enterButton/>
                    </div>
                </Header>
                <Layout>
                    <Router>
                        <Sider breakpoint="lg" collapsedWidth="0">
                            <NavigateBar/>
                        </Sider>
                        <Content>
                            <div>
                                <Route exact path="/" component={HomePage}/>
                                <Route path="/callback" component={HomePage}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/register" component={Register}/>
                                <Route path="/modifypwd" component={Modifypwd}/>
                                <Route path="/board/emotion" component={Board}/>
                                <Route path="/board/study" component={Board}/>
                                <Route path="/board/information" component={Board}/>
                                <Route path="/board/intern" component={Board}/>
                                <Route path="/post" component={post}/>
                                <Route path="/myPosts" component={myPosts}/>
                            </div>
                        </Content>
                    </Router>
                </Layout>
                <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
            </Layout>
        )
            ;
    }
}

ReactDOM.render(<Routing/>, document.getElementById("root"));
