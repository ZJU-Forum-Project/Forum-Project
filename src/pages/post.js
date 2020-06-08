import {Upload, Button, Comment, Descriptions, Form, Input, List, message, Modal, Spin, Avatar, Progress} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';
import InfiniteScroll from 'react-infinite-scroller';
import "../asset/board.css"
import NotLogin from "../components/notlogin";
import React from 'react';
import {  PlusOutlined } from '@ant-design/icons';

const {TextArea} = Input;
const Editor = ({onChange, onSubmit, submitting, value}) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value}/>
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        let name = cookie.load("name");
        this.state = {
            id: "", //帖子id
            token: "", //验证
            title: "",
            content: "",
            replyId: "",
            replyUI: "",
            author: "",
            time: "", //帖子创建时间
            replyList: [],
            value: "",
            submitting: false,
            comments: [],
            name: name,
            re_Author: true, //回复楼主标记
            loading: false,
            hasMore: true,
            data: [],
            eVisible: false,
            dVisible: false,
            rVisible: false,
            floorId: "",
            floorUI: "",
            rpVisible: false,
            dpVisible: false,
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [],
            previewPVisible: false,
            pictureList: [],
            urlList: []
        }

        //绑定需要调用的async函数
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('postingID', id());
        formData.append('Authorization', token);
        await axios.post("/api/postings/" + id(), formData)
            .then(response => {
                const data = response.data;
                this.setState({
                    token: token,
                    title: data.title,
                    author: data.author,
                    time: data.time,
                    content: data.content,
                    replyList: data.replyList,
                });
            })
        let format = new FormData();
        format.append('postId', id())
        format.append('Authorization', token)
        await axios.post("/api/seePicture", format)
            .then(response => {
                const data = response.data;
                let urls = []
                for(var i=0; i<data.length; i++){
                    if(data[i].url == null){
                        urls.push(null);
                    } else {
                        urls.push('http://106.12.27.104/'+data[i].url)
                    }
                }
                console.log(data)
                this.setState({
                    pictureList: data,
                    urlList: urls
                })
            })
    }

    async handleSubmit() {
        let ret = null;
        if (!this.state.value) {
            this.setState({
                submitting: false,
            });
            return;
        }
        this.setState({
            submitting: true,
        });

        let formData = new FormData();
        formData.append('author', this.state.name);
        formData.append('Authorization', this.state.token);
        formData.append('postId', id());
        console.log(this.state.token);
        console.log(this.state.author);

        if (this.state.re_Author == true) {
            formData.append('content', this.state.value);
            ret = (await axios.post('/api/ReplyPosting', formData)).data;
            let state = ret.state;
            //根据返回值进行处理
            if (state == true) {
                window.location.reload()//直接打开新网页
            } else {
                let message = ret.message;
                alert(message);
            }
        } else {
            formData.append('content', "回复第" + this.state.replyUI + "楼：" + this.state.value);
            formData.append("floorId", this.state.replyId);
            ret = (await axios.post('/api/GetFloor', formData)).data;
            let state = ret.state;
            //根据返回值进行处理
            if (state == true) {
                formData.append('replyId', this.state.floorId);
                formData.append('replyUI', ret.replyUI);

                ret = (await axios.post('/api/ReplyFloor', formData)).data;
                let state = ret.state;
                //根据返回值进行处理
                if (state == true) {
                    window.location.reload()//直接打开新网页
                } else {
                    let message = ret.message;
                    alert(message);
                }
            } else {
                let message = ret.message;
                alert(message);
            }
        }

        this.setState({
            submitting: false,
            re_Author: true
        });

    };

    handleReply(event) {
        this.setState({
            re_Author: false,
            replyId: event.target.getAttribute("data-floorId"),
            replyUI: event.target.getAttribute("data-floorUI"),
            rVisible: true
        })
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
        });
    };

    handleInfiniteOnLoad() {
        let {data} = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > this.state.replyList.length) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }

        data = data.concat(this.state.replyList);
        this.setState({
            data,
            loading: false,
        });
    }

    async handleEdit(event) {
        let formData = new FormData();
        formData.append("Authorization", this.state.token);
        this.setState({
            floorId: event.target.getAttribute("data-floorId")
        });
        console.log(this.state.floorId);
        formData.append("floorId", this.state.floorId);
        let ret = (await axios.post('/api/GetFloor', formData)).data;
        let state = ret.state;
        if (state == true) {
            console.log(ret.content)
            this.setState({
                content: ret.content,
                value: ret.content,
                replyId: ret.replyId,
                replyUI: ret.replyUI,
                eVisible: true
            })
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    async handleEditOk() {
        let formData = new FormData();
        formData.append("floorId", this.state.floorId);
        formData.append('Authorization', this.state.token);
        if (this.state.replyId != 0) {
            formData.append("content", "回复" + this.state.replyUI + "楼：" + this.state.value);
        }
        else{
            formData.append("content", this.state.value);
            console.log(this.state.value)
        }
        formData.append("replyId", this.state.replyId);

        let ret = (await axios.post('/api/ModifyFloor', formData)).data;
        let state = ret.state;

        if (state == true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }

        this.setState({
            eVisible: false,
        });
    }

    async handleDelete(event) {
        this.setState({
            dVisible: true,
            floorId: event.target.getAttribute("data-floorId")
        })
    }

    async handleDeleteOk() {
        let formData = new FormData();
        this.setState({
            dVisible: false
        });
        formData.append("floorId", this.state.floorId);
        formData.append('Authorization', this.state.token);

        let ret = (await axios.post('/api/DeleteReply', formData)).data;
        let state = ret.state;

        if (state == true) {
            window.location.reload()//直接打开新网页
        } else {
            let message = ret.message;
            alert(message);
        }
    }

    handleECancel() {
        this.setState({
            eVisible: false,
        });
    };

    handleDCancel() {
        this.setState({
            dVisible: false,
        });
    };

    handleRCancel() {
        this.setState({
            rVisible: false,
        });
    };

    handleUpdatePicture(event) {
        this.setState({
            rpVisible: true,
            floorUI: event.target.getAttribute("data-floorUI"),
        })
    }
    async handleUpdatePictureOk() {
        console.log(this.state.pictureList)
        if(this.state.pictureList[this.state.floorUI].url!=null){
            let pictureId = this.state.pictureList[this.state.floorUI].pictureId
            let token = cookie.load("token");
            let formData = new FormData();
            formData.append('pictureId', pictureId);
            formData.append('Authorization', token);
            await axios.post('/api/deletePicture', formData)
                .then(response => {
                    const data = response.data
                })
        }
        if(this.state.previewImage != null){
            let token = cookie.load("token");
            let formData = new FormData();
            formData.append('floorNumber', this.state.floorUI);
            formData.append('Authorization', token);
            formData.append('postId', id());
            formData.append('file', dataURLtoFile(this.state.fileList[0].thumbUrl, this.state.fileList[0].name));
            await axios.post('/api/uploadPicture', formData)
                .then(response => {
                    const data = response.data
                    console.log(data)
                    this.setState({
                        rpVisible: false,
                    })
                })
            window.location.reload()//刷新
        }
    }
    handleDeletePicture(event) {
        let floorUI = event.target.getAttribute("data-floorUI")
        this.setState({
            floorUI: event.target.getAttribute("data-floorUI"),
        })
        if(this.state.pictureList[floorUI].url!=null){
            this.setState({
                dpVisible: true,
            })
        }
    }
    handleDeletePictureOk() {
        let pictureId = this.state.pictureList[this.state.floorUI].pictureId
        let token = cookie.load("token");
        let formData = new FormData();
        formData.append('pictureId', pictureId);
        formData.append('Authorization', token);
        axios.post('/api/deletePicture', formData)
            .then(response => {
                const data = response.data
                console.log(data)
            })
        window.location.reload()//刷新
    }
    handleRPCancel() {
        this.setState({
            rpVisible: false,
        });
    };
    handleDPCancel() {
        this.setState({
            dpVisible: false,
        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
            });
        
    };

    handlePChange = ({ fileList }) => this.setState({ fileList });
    

    is_Current_User(item){
        console.log(item);
        if(this.state.name == item.author){
            let actions = [<span key="comment-basic-reply-to" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleReply.bind(this)}>Reply to</span>]
            return actions
        }
        else{
            let actions = [<span key="comment-basic-reply-to" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                 onClick={this.handleReply.bind(this)}>Reply to</span>,
                            <span key="comment-basic-edit" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleEdit.bind(this)}>Edit</span>,
                            <span key="comment-basic-delete" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleDelete.bind(this)}>Delete</span>,
                            <span key="comment-picture-update" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleUpdatePicture.bind(this)}>Update picture</span>,
                            <span key="comment-picture-delete" data-floorId={item.floorId} data-floorUI={item.floorUI}
                                  onClick={this.handleDeletePicture.bind(this)}>Delete picture</span>
                        ]
            return actions
        }
    }

    render() {
        this.state.id = id();
        const uploadButton = (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">Upload</div>
          </div>
          );
        let reply=[
            {author:'12', title:'123', time: '123123'},
            {author:'34', title:'1234', time: '123123444'},
        ]
        if (cookie.load("token")) {
            return (
                <div>
                    <div className="description-title">
                        <Descriptions layout="vertical" title={"this.state.title"} bordered>
                            <Descriptions.Item label="创建时间">{"this.state.time"}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="demo-infinite-container">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={this.handleInfiniteOnLoad}
                            hasMore={!this.state.loading && this.state.hasMore}
                            useWindow={false}
                        >
                        <div>
                            <List
                                dataSource={this.state.replyList}
                                renderItem={item => (
                                <List.Item>
                                    <Comment
                                        avatar={
                                            <Avatar
                                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                alt="Han Solo"
                                            />
                                        }
                                        actions={this.is_Current_User(item)}
                                        author={item.author}
                                        children={<img className="pictureOfReply" src={this.state.urlList[item.floorUI]}></img>}
                                        datetime={item.time}
                                        content={item.content}
                                    />
                                    <Progress
                                        type="circle"
                                        format={() => `${item.floorUI} 楼`}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        percent={100}
                                        width={50}
                                    />
                                </List.Item>
                                )}
                            >
                                {this.state.loading && this.state.hasMore && (
                                    <div className="demo-loading-container">
                                        <Spin/>
                                    </div>
                                )}
                            </List>
                        </div>
                        </InfiniteScroll>
                    </div>
                    <Modal
                        title="Edit"
                        visible={this.state.rVisible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleRCancel.bind(this)}
                    >
                        <p>回复{this.state.replyUI}楼:</p>
                        <textarea placeholder="正文"
                                  style={{
                                      width: "100%",
                                      height: "300px",
                                      textIndent: "8px"
                                  }}
                                  type="text" name="content" onChange={this.handleChange}/>
                    </Modal>
                    <Modal
                        title="Edit"
                        visible={this.state.eVisible}
                        onOk={this.handleEditOk.bind(this)}
                        onCancel={this.handleECancel.bind(this)}
                    >
                        <p>回复{this.state.replyUI}楼:</p>
                        <textarea placeholder="正文"
                                  style={{
                                      width: "100%",
                                      height: "300px",
                                      textIndent: "8px"
                                  }}
                                  type="text" name="content" onChange={this.handleChange}/>
                    </Modal>
                    <Modal
                        title="Delete"
                        visible={this.state.dVisible}
                        onOk={this.handleDeleteOk.bind(this)}
                        onCancel={this.handleDCancel.bind(this)}
                    >
                        <p>是否确认删除该回复？</p>
                    </Modal>
                    <Modal
                        title="DeletePic"
                        visible={this.state.dpVisible}
                        onOk={this.handleDeletePictureOk.bind(this)}
                        onCancel={this.handleDPCancel.bind(this)}
                    >
                        <p>是否确认删除该图片？</p>
                    </Modal>
                    <Modal
                        title="AddPic"
                        visible={this.state.rpVisible}
                        onOk={this.handleUpdatePictureOk.bind(this)}
                        onCancel={this.handleRPCancel.bind(this)}
                    >
                        <div className="clearfix">
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                onChange={this.handlePChange}
                            >
                            {this.state.fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={this.state.previewVisible}
                                title={this.state.previewTitle}
                                footer={null}
                                onCancel={this.handleCancel}
                            >
                            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                        </div>
                    </Modal>
                    <div className="edit-style">
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            submitting={this.state.submitting}
                            value={this.state.value}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{fontSize: "100px", float: "center", textAlign: "center"}}><NotLogin/></div>
            );
        }
    }

}

function id() {
    var url = window.location.href;
    var content = url.split("/");
    if (content.length < 5)
        return 0;
    else {
        return content[4];
    }
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

function dataURLtoFile(dataurl, filename) {//将base64转换为文件
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

function getBase64Url(imgUrl) {
  window.URL = window.URL || window.webkitURL;
  var xhr = new XMLHttpRequest();
  xhr.open("get", imgUrl, true);
  // 至关重要
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      //得到一个blob对象
      var blob = this.response;
      console.log("blob", blob)
      // 至关重要
      let oFileReader = new FileReader();
      oFileReader.onloadend = function (e) {
        // 此处拿到的已经是 base64的图片了
        let base64 = e.target.result;
        console.log("方式一》》》》》》》》》", base64)
        return base64;
      };
    }
  }
  xhr.send();
}
