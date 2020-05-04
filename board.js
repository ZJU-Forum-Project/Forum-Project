import { Layout, Breadcrumb, Button,PageHeader, Avatar, icons, List, Alert, notification, Form,Input} from 'antd';
import NavigateBar from '../components/navigate';
import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import "../asset/board.css"


const { Header, Footer, Sider, Content } = Layout;
let posts = [
    {post_title:"qwe", content:"zheshiyige", id:1},
    {post_title:"qwer", content:"zheshiyigeqwe", id:2},
    {post_title:"qwert", content:"zheshiyigeqwertr", id:3},
    {post_title:"qwetyu", content:"zheshiyigeasdsfsf", id:4},
    {post_title:"qwetyui", content:"zheshiyigeasdsfsfzxc", id:5}
];
export default class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            type : "", //板块类型
            token: "", //验证
            display_name: 'none',//发帖区域显示状态
            notdisplay_name:'block'//按钮显示状态
        }
    }

    display_name() { //编辑按钮的单击事件，修改状态机display_name的取值
        if (this.state.display_name == 'none') {
            this.setState({
                display_name: 'block',
                notdisplay_name: 'none'
            })
        }
        else if (this.state.display_name == 'block') {
            this.setState({
                display_name: 'none',
                notdisplay_name: 'block'
            })

        }
    }

    checkTitle(rule, value, callback) {//待定
        const reg = 0//^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
        }
        callback();
    }
    checkContent(rule, value, callback) {//待定
        const reg = 0//^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (!reg.test(value)) {
        }
        callback();
    }

    render() {
        this.state.token = cookie.load("token");
        let formData = new FormData();
        formData.append('token',this.state.token);
        this.state.type = type();
        let postsTemp = axios.post("/api/board/" + type());

        return(
            <Layout className="layout">
                <NavigateBar />
                <PageHeader style={{ padding: '20px 50px' }} title={title(this.state.type)} />   

                <p class="slide" style={{ display: this.state.notdisplay_name }}>
                    <Button type="primary" id="createPost" style={{ float: 'left', marginLeft: 50 }}
                        onClick={this.display_name.bind(this)}>
                        {/**./createPost*/}
                        发帖
                    </Button>
                </p>
                {/*发帖区域动态显示 */}
            <div style={{display: this.state.display_name}}>
                    <h3 style={{ padding: '0px 50px' }}>新建帖子</h3>

                <div>
                        <Layout className="layout">
                        <Content>
                        <Form
                            name="basic"
                            initialValues={{ remember: true }}
                                >
                            <Form.Item
                                name="title"
                                rules={[{ 
                                        required: true, message: '请输入标题!' 
                                    },{
                                        validator: this.checkTitle.bind(this)
                                    }
                                ]}
                            >
                                        <Input placeholder="标题"
                                            style={{ width: "80%", marginLeft: '50px',marginTop:'10px'}}
                                            type="text" name="title" onChange={this.handleChange} />
                            </Form.Item>
                            <Form.Item
                                 name="content"
                                 rules={[{
                                        required: true, message: '请输入正文!'
                                 }, {
                                         validator: this.checkContent.bind(this)
                                    }
                                ]}
                            >
                                        <textarea placeholder="正文"
                                            style={{ width: "80%", height: "300px",marginLeft: '50px',textIndent:"8px" }}
                                            type="text" name="content" onChange={this.handleChange} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ float: 'left', marginLeft: 50 }} onClick={this.submit}>
                                发送
                                </Button>
                                <Button id="send" style={{ float: 'left', marginLeft: 10 }}
                                            onClick={this.display_name.bind(this)}>
                                            取消
                                </Button>
                                <Button id="hidePost" style={{ float: 'right', marginRight:"10%" }}
                                            onClick={this.display_name.bind(this)}>
                                            保存草稿（没实现，现同取消）
                                </Button>
                            </Form.Item>

                        </Form>
                        </Content>
                        </Layout>
                </div>
            </div>


                <Content style={{ padding: '0px 50px'}}>
                    <List
                        pagination={{
                        onChange: page => {
                          console.log(page);
                        },
                        pageSize: 4,
                        }}
                        itemLayout="horizontal"
                        dataSource={posts}
                        renderItem={item => (
                        <List.Item actions={[<div>date</div>]}>
                            <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={[<div><a href={'/post/' + item.id}>post_titie</a></div>]}
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
function type(){
    var url = window.location.href;
    var content = url.split("/");
    if(content.length<5)
        return "study";
    else {
        return content[4];
    }
}

function title(type){
    if(type==null)
        return "板块信息";
    else {
        if(type == "emotion")
            return "情感交流";
        else if(type == "information")
            return "校园生活";
        else if(type == "intern")
            return "实习信息";
        else if(type == "study")
            return "学习资料";
    }
}

