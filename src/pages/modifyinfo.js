import {Breadcrumb, Button, DatePicker, Form, Input, Layout} from 'antd';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import {Radio, RadioGroup} from 'react-radio-group'
import NotLogin from "../components/notlogin";
import Avatar from 'react-avatar-edit'
import $ from 'jquery'

const {Content} = Layout;
const layout = {labelCol: { span: 8 },wrapperCol: { span: 16 }};

class modifyinfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email:'defaultemail@default.com',
            email_hidden:'',
            birthday:new Date(1900,1,1,0,0,0),     //切记Date是引用类型
            birthday_string:"",
            birthday_hidden:0,
            gender:"男",
            gender_hidden:0,
            phone:'',
            phone_hidden:0,
            real_name:'',
            real_name_hidden:0,
            hometown:'',
            hometown_hidden:0,
            organization:'',
            organization_hidden:0,
            signature:'',
            signature_hidden:0,
            token: '',
            preview: null,
            //头像相关：
            src: '',
            file: '',
            originalAvatar: '',
            originalSrc: '',
            display_name: 'none',//头像区域显示状态
            notdisplay_name: 'block',//取消按钮显示状态
        }
        this.onCrop = this.onCrop.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this);
        //绑定this指针（可以使用箭头函数来替代）
        this.handleInputChange=this.handleInputChange.bind(this);
        //  this.handleBirthdayChange=this.handleBirthdayChange.bind(this);//使用箭头函数，无需绑定
        //  this.handleBirthdayOk=this.handleBirthdayOk.bind(this); //使用箭头函数，无需绑定
        this.handleGenderChange=this.handleGenderChange.bind(this);
        this.handleBirthdayHiddenChange=this.handleBirthdayHiddenChange.bind(this);
        this.handleGenderHiddenChange=this.handleGenderHiddenChange.bind(this);
        this.handlePhoneHiddenChange=this.handlePhoneHiddenChange.bind(this);
        this.handleRealNameHiddenChange=this.handleRealNameHiddenChange.bind(this);
        this.handleHometownHiddenChange=this.handleHometownHiddenChange.bind(this);
        this.handleOrganizationHiddenChange=this.handleOrganizationHiddenChange.bind(this);
        this.handleSignatureHiddenChange=this.handleSignatureHiddenChange.bind(this);
        this.load_info=this.load_info.bind(this);
        this.submit = this.submit.bind(this);
        this.submitAvatar = this.submitAvatar.bind(this);
    }

    display_name() { //编辑头像按钮的单击事件，修改状态机display_name的取值
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

    onClose() {
        let originalSrc = this.state.originalSrc;
        this.setState({ preview:originalSrc})//设为原头像
    }

    onCrop(preview) {
        this.setState({ preview, })
    }

    onBeforeFileLoad(elem) {
        if (elem.target.files[0].size > 5000000) {
            alert("File is too big!");
            elem.target.value = "";
        };
    }

    //当输入框内的值发生改变时，触发此函数
    handleInputChange(event){

        console.log("handleInputChange(event) is called");
        console.log("Show event.target");
        console.log("%o",event.target);

        //由于多个组件需要监听Onchange，此处基于name修改对应的值
        this.setState({[event.target.name]: event.target.value});
    }

    handleBirthdayChange=(value, dateString)=>{
        console.log("handleBirthdayChange(date,datestring) is called");
        this.setState({birthday: value,
            birthday_string:dateString });
        console.log("Show this.state.birthday:");
        console.log(this.state.birthday);
        console.log("Show this.state.birthday_string:");
        console.log("%o",this.state.birthday_string);

    }
    handleBirthdayOk=(value)=>{
        console.log("handleBirthdayOk(value) is called");
        this.setState({birthday: value });
        console.log("Show this.state.birthday:");
        console.log(this.state.birthday);

    }

    //当以下单选框选择发生改变时，触发相应函数
    handleGenderChange(value){
        this.setState({gender: value});
    }
    handleBirthdayHiddenChange(value){
        this.setState({birthday_hidden: value});
    }
    handleGenderHiddenChange(value){
        this.setState({gender_hidden: value});
    }
    handlePhoneHiddenChange(value){
        this.setState({phone_hidden: value});
    }
    handleRealNameHiddenChange(value){
        this.setState({real_name_hidden: value});
    }
    handleHometownHiddenChange(value){
        this.setState({hometown_hidden: value});
    }
    handleOrganizationHiddenChange(value){
        this.setState({organization_hidden: value});
    }
    handleSignatureHiddenChange(value){
        this.setState({signature_hidden: value});
    }


    //检查输入的email是否符合邮箱格式(若输入为空则不检查)
    checkEmail(rule,value,callback){
        const reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if(!reg.test(value) && value!="" ){
            callback('请输入正确的邮箱地址');
        }
        callback();
    }



    //向后端发送token，接收InfoMessage类对象。若查询成功则将各项值加载到组件的state中，否则弹窗提示原因。
    async load_info(){
        console.log("load_info() is called");

        //读入cookie中的token
        let token=cookie.load('token');
        console.log("token: "+token);

        let formData = new FormData();
        //非登录状态传输数据的方式
        formData.append('token',token);
        formData.append('Authorization',token);

        //调用后端queryinfo接口，发送token,返回InfoMessage类对象
        let query_return=(await axios.post('/api/queryinfo',formData)).data;
        console.log("Show query_return:");
        console.log("%o",query_return);

        //如果查询失败，弹窗提示原因
        if(query_return.state == false){
            alert(query_return.message);
        }

        //如果查询成功
        else{
            console.log("Query Success!");

            //更新state
            if(query_return.email!=null){
                this.setState({
                    email: query_return.email
                });
            }
            if(query_return.birth!=null){
                this.setState({
                    birthday: query_return.birth
                });
            }
            if(query_return.birth_hidden!=null){
                this.setState({
                    birthday_hidden: query_return.birth_hidden
                });
            }
            if(query_return.gender!=null && query_return.gender!=""){
                this.setState({
                    gender: query_return.gender
                });
            }
            if(query_return.gender_hidden!=null){
                this.setState({
                    gender_hidden: query_return.gender_hidden
                });
            }
            if(query_return.phone!=null){
                this.setState({
                    phone: query_return.phone
                });
            }
            if(query_return.phone_hidden!=null){
                this.setState({
                    phone_hidden: query_return.phone_hidden
                });
            }
            if(query_return.real_name!=null){
                this.setState({
                    real_name: query_return.real_name
                });
            }
            if(query_return.real_name_hidden!=null){
                this.setState({
                    real_name_hidden: query_return.real_name_hidden
                });
            }
            if(query_return.hometown!=null){
                this.setState({
                    hometown: query_return.hometown
                });
            }
            if(query_return.hometown_hidden!=null){
                this.setState({
                    hometown_hidden: query_return.hometown_hidden
                });
            }
            if(query_return.organization!=null){
                this.setState({
                    organization: query_return.organization
                });
            }
            if(query_return.organization_hidden!=null){
                this.setState({
                    organization_hidden: query_return.organization_hidden
                });
            }
            if(query_return.signature!=null){
                this.setState({
                    signature: query_return.signature
                });
            }
            if (query_return.avatarUrl != null) {
                this.setState({
                    originalAvatar: query_return.avatarUrl
                });

            axios.get('/api/getBase64PictureByUrl', {
                    params: {
                        url: this.state.originalAvatar
                    }
                })
                    .then(function (res) {
                        this.state.originalSrc = res.data;
                        console.log("Get Base64 AVATAR");
                        console.log(this.state.originalSrc);
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            //以下代码不能赋值，用于在控制台检查（url通过Promise和canvas解析的base64）与（后端api/getBase64PictureByUrl返回值）是否相符。
                var imgUrl = this.state.originalAvatar
                function getBase64(img) {//传入图片路径，返回base64
                    function getBase64Image(img, width, height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
                        var canvas = document.createElement("canvas");
                        canvas.width = width ? width : img.width;
                        canvas.height = height ? height : img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        var dataURL = canvas.toDataURL();
                        return dataURL;
                    }
                    var image = new Image();
                    image.crossOrigin = '';
                    image.src = img;
                    var deferred = $.Deferred();
                    if (img) {
                        image.onload = function () {
                            deferred.resolve(getBase64Image(image));//将base64传给done上传处理
                        }
                        return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
                    }
                }
                getBase64(imgUrl)//本地可
                    .then(function (base64) {
                        console.log("Src Resolve Success!");
                        console.log("Promise与Canvas通过url解析的base64(非后端获取数据)："+base64);
                        //this.state.originalSrc = base64是不能赋给originalSrc的，Promise拿不到只能console.log报在控制台
                        console.log(this.state.originalSrc);
                        $("#test").attr("src", base64)
                        return Promise.resolve(base64)
                    }, function (err) {
                        console.log("Src Err!!");
                    });
            this.state.preview = this.state.originalSrc;
            console.log("information loaded!")
            console.log("Show this.state:");
            console.log("%o",this.state);

        }
    }



    //点击提交时，调用后端api，将修改后的数据传给服务器
    async submit(){
        console.log("submit() is called");

        let formData = new FormData();

        //读入cookie中的token
        let token=cookie.load('token');
        //读入state中的数据
        let email=this.state.email;
        var birth=this.state.birthday_string;
        let birth_hidden=this.state.birthday_hidden;
        let gender=this.state.gender;
        let gender_hidden=this.state.gender_hidden;
        let phone=this.state.phone;
        let phone_hidden=this.state.phone_hidden;
        let real_name=this.state.real_name;
        let real_name_hidden=this.state.real_name_hidden;
        let hometown=this.state.hometown;
        let hometown_hidden=this.state.hometown_hidden;
        let organization=this.state.organization;
        let organization_hidden=this.state.organization_hidden;
        let signature = this.state.signature;
        //this.state.file = changeSrc(this.state.preview);//preview改成file
        //写预览要把query到的file转化成src(base64)和上传图片前默认的preview(base64),
        //非登录状态传输数据的方式
        formData.append('token',token);
        formData.append('Authorization',token);
        formData.append('birth',birth);
        formData.append('birth_hidden',birth_hidden);
        formData.append('gender',gender);
        formData.append('gender_hidden',gender_hidden);
        formData.append('phone',phone);
        formData.append('phone_hidden',phone_hidden);
        formData.append('real_name',real_name);
        formData.append('real_name_hidden',real_name_hidden);
        formData.append('hometown',hometown);
        formData.append('hometown_hidden',hometown_hidden);
        formData.append('organization',organization);
        formData.append('organization_hidden',organization_hidden);
        formData.append('signature', signature);

        console.log("Show each var[a,b] in formData.entries()");
        for (var [a, b] of formData.entries()) {
            console.log(a, b);
        }

        //调用后端queryinfo接口，发送信息,返回InfoMessage类对象
        let edit_return=(await axios.post('/api/editinfo',formData)).data;

        console.log("Show edit_return:");
        console.log("%o",edit_return);

        //如果查询失败，弹窗提示原因
        if(edit_return.state == false){
            alert(edit_return.message);
        }

        //如果查询成功
        else{
            window.location.href = "http://106.12.27.104/personinfo";
        }
    }

    //在渲染前调用
    componentWillMount(){
        console.log("componentWillMount() is called");

        if(cookie.load("token")){
            console.log("call load_info()");
            this.load_info();
        }
    }

    async submitAvatar() {
        console.log("submitAvatar() is called");

        let formData = new FormData();

        //读入cookie中的token
        let token = cookie.load('token');
        //读入state中的数据
        //this.state.file = changeSrc(this.state.preview);//preview改成file
        //写预览要把query到的file转化成src(base64)和上传图片前默认的preview(base64),
        function dataURLtoFile(dataurl){
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var filename = '';
            var i = 0;
            for (i = 0; i < 12; i++) {
                filename += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return new File([u8arr],filename+".jpg",{type: mime });
        }
        //调用
        this.state.file = dataURLtoFile(this.state.preview);
        let file = this.state.file;

        //非登录状态传输数据的方式
        formData.append('token', token);
        formData.append('Authorization', token);
        formData.append('file', file);

        console.log("Show each var[a,b] in formData.entries()");
        for (var [a, b] of formData.entries()) {
            console.log(a, b);
        }

        //调用后端queryinfo接口，发送信息,返回InfoMessage类对象
        let edit_return = (await axios.post('/api/uploadAvatar', formData)).data;

        console.log("Show edit_return:");
        console.log("%o", edit_return);

        //如果查询失败，弹窗提示原因
        if (edit_return.state == false) {
            alert(edit_return.message);
        }

        //如果查询成功
        else {
            alert("保存成功！");
        }
    }

    //在渲染前调用
    componentWillMount() {
        console.log("componentWillMount() is called");

        if (cookie.load("token")) {
            console.log("call load_info()");
            this.load_info();
        }
    }

    render() {

        console.log("render() is called");

        //若用户已登录
        //以下两行代码：为方便前端进行界面，暂时使条件判断失效
        //if(1){
        if(cookie.load("token")){
            var iemail = this.state.email;
            var ibirthday = this.state.birthday;//实际显示月份多1
            var iphone = this.state.phone;
            var ireal_name = this.state.real_name;
            var ihometown = this.state.hometown;
            var iorganization = this.state.organization;
            var isignature = this.state.signature;
            var ihometown = this.state.hometown;

            return(
                <Layout className="layout">
                    <Content style={{padding: '0 50px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>修改个人信息</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content"style={{textAlign: 'center',fontSize:'30px'}}>
                            修改个人信息
                            <Form
                                {...layout}
                                name="basic"
                                initialValues={{ remember: true }}
                            >

                                <Form.Item
                                    style={{ margin: '16px 100px 15px -200px' }}
                                    label="Profile"
                                    name="avatar"
                                >
                                    <div style={{ Align: 'center' }}>
                                        <p>profile preview:</p>
                                        <img src={this.state.preview} width="100px" height="100" alt="" />
                                        <div class="slide" style={{ display: this.state.notdisplay_name, Align: 'center' }}>
                                            <Button id="mdAvatar" style={{ marginTop: '8px' }}
                                                onClick={this.display_name.bind(this)}>
                                                EDIT
                                        </Button>
                                        </div>
                                        <div style={{ paddingTop: '15px', paddingLeft: '20%', display: this.state.display_name }}>
                                            <Avatar
                                                width={350}
                                                height={300}
                                                onCrop={this.onCrop}
                                                onClose={this.onClose}
                                                onBeforeFileLoad={this.onBeforeFileLoad}
                                                src={this.state.src}
                                            />
                                        </div>
                                        <div style={{ paddingTop: '15px', Align: 'center', display: this.state.display_name }}>
                                        <Button type="primary" onClick={this.submitAvatar}>
                                            保存
                                        </Button>
                                        </div>
                                    </div>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Email"
                                    name="email"
                                    rules={[{
                                        max: 50, message: 'email不能多于50个字符!'
                                    },{
                                        validator:this.checkEmail.bind(this)
                                    }]}
                                >
                                    <Input type="text"
                                           placeholder={iemail}
                                           readonly="readonly"/>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Birthday"
                                    name="birthday"
                                >

                                    <DatePicker name="birthday" placeholder={ibirthday}
                                                value={ibirthday}
                                                onChange={this.handleBirthdayChange}
                                                onOk = {this.handleBirthdayOk}
                                    />
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Gender"
                                >

                                    <RadioGroup
                                        name="gender"
                                        selectedValue={this.state.gender}
                                        onChange={this.handleGenderChange}>
                                        <Radio value="男" />Man
                                        <Radio value="女" />Woman
                                    </RadioGroup>



                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Phone"
                                    name="phone"
                                    rules={[{
                                        max: 50, message: '电话号码不能多于50个字符!'
                                    }]}
                                >
                                    <Input name="phone" type="text" placeholder={iphone} value={iphone} onChange={this.handleInputChange}/>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Real_name"
                                    name="real_name"
                                    rules={[{
                                        max: 50, message: '真实姓名不能多于50个字符!'
                                    }]}
                                >
                                    <Input name="real_name" type="text" placeholder={ireal_name} value={this.state.real_name} onChange={this.handleInputChange}/>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Hometown"
                                    name="hometown"
                                    rules={[{
                                        max: 50, message: '户籍所在地不能多于50个字符!'
                                    }]}
                                >
                                    <Input name="hometown" type="text" placeholder={ihometown} value={ihometown} onChange={this.handleInputChange}/>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Organization"
                                    name="organization"
                                    rules={[{
                                        max: 50, placeholder: '组织名称不能多于50个字符!'
                                    }]}
                                >
                                    <Input name="organization" type="text" placeholder={iorganization} value={iorganization} onChange={this.handleInputChange}/>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px -200px'}}
                                    label="Signature"
                                    name="signature"
                                    rules={[{
                                        max: 200, message: '个性签名不能多于200个字符!'
                                    }]}
                                >
                                    <Input name="signature" type="textarea" placeholder={isignature} value={isignature} onChange={this.handleInputChange}/>
                                </Form.Item>

                            </Form>
                        </div>

                        <div className="site-layout-content"style={{textAlign: 'center',fontSize:'30px'}}>
                            隐私设置
                            <br/><br/><br/>
                            <Form>
                                <Form.Item
                                    style={{margin: '16px 100px 15px 300px'}}
                                    label="是否隐藏生日"
                                    name=""
                                >
                                    <RadioGroup
                                        name="brithday_hidden"
                                        selectedValue={this.state.birthday_hidden}
                                        onChange={this.handleBirthdayHiddenChange}>
                                        <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                        <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                                    </RadioGroup>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px 300px'}}
                                    label="是否隐藏性别"
                                    name=""
                                >
                                    <RadioGroup
                                        name="gender_hidden"
                                        selectedValue={this.state.gender_hidden}
                                        onChange={this.handleGenderHiddenChange}>
                                        <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                        <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                                    </RadioGroup>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px 300px'}}
                                    label="是否隐藏电话"
                                    name=""
                                >
                                    <RadioGroup
                                        name="phone_hidden"
                                        selectedValue={this.state.phone_hidden}
                                        onChange={this.handlePhoneHiddenChange}>
                                        <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                        <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                                    </RadioGroup>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px 300px'}}
                                    label="是否隐藏真实姓名"
                                    name=""
                                >
                                    <RadioGroup
                                        name="real_name_hidden"
                                        selectedValue={this.state.real_name_hidden}
                                        onChange={this.handleRealNameHiddenChange}>
                                        <Radio value={1} style={{margin: '0px 0px 0px -728px'}}/>是
                                        <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                                    </RadioGroup>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px 300px'}}
                                    label="是否隐藏家乡"
                                    name=""
                                >
                                    <RadioGroup
                                        name="hometown_hidden"
                                        selectedValue={this.state.hometown_hidden}
                                        onChange={this.handleHometownHiddenChange}>
                                        <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                        <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                                    </RadioGroup>
                                </Form.Item>

                                <Form.Item
                                    style={{margin: '16px 100px 15px 300px'}}
                                    label="是否隐藏组织"
                                    name=""
                                >
                                    <RadioGroup
                                        name="organization_hidden"
                                        selectedValue={this.state.organization_hidden}
                                        onChange={this.handleOrganizationHiddenChange}>
                                        <Radio value={1} style={{margin: '0px 0px 0px -700px'}}/>是
                                        <Radio value={0} style={{margin: '0px 0px 0px 40px'}}/>否
                                    </RadioGroup>
                                </Form.Item>

                                <Form.Item
                                    style={{textAlign: 'center'}}
                                >
                                    <Button type="primary"  onClick={this.submit}>
                                        保存
                                    </Button>

                                    <Link to="/personinfo">
                                        <Button type="default" >
                                            取消
                                        </Button>
                                    </Link>
                                </Form.Item>
                            </Form>
                        </div>

                    </Content>
                </Layout>
            )
        }

        //若用户未登录，显示登录提示界面
        else{
            return(
                <div style={{textAlign: "center", fontSize: "400%"}}><NotLogin/></div>
            );
        }
    }
}

export default modifyinfo;