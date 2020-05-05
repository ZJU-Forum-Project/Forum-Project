import {Layout, Breadcrumb} from 'antd';
import NavigateBar from '../components/navigate';
import ReactDOM from 'react-dom';
import React from 'react';

const {Header, Content, Footer, Sider} = Layout;
export default class HomePage extends React.Component {
    render() {
        return (
            <Layout style={{width: "100%", height: "1000px"}}>
                <Sider breakpoint="lg" collapsedWidth="0">
                    <NavigateBar/>
                </Sider>
                <Layout>
                    <Content>
                        <div className="site-layout-content">Content</div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
                </Layout>
            </Layout>
        );
    }
}
ReactDOM.render(
    <HomePage/>
    , document.getElementById("root"));
