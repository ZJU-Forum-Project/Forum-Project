import {BugOutlined} from "@ant-design/icons";
import React from "react";
import {Link} from "react-router-dom";


class NotLogin extends React.Component {
    render() {
        return (
            <Link to="/login">
                <BugOutlined/> 当前未登录
            </Link>
        );
    }
}

export default NotLogin;

