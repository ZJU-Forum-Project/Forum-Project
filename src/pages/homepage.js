import {Layout,  Breadcrumb} from 'antd';
import NavigateBar from '../components/navigate';
import ReactDOM from 'react-dom';
import React from 'react';

const {Footer, Content} = Layout;
export default class HomePage extends React.Component {
    render() {
        return(
            <Layout className="layout">
                <NavigateBar />
                <Content style={{padding: '0 50px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content">Content</div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
            </Layout>
      );
    }
}
ReactDOM.render(<HomePage />, document.getElementById("root"));