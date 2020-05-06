import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import HomePage from './pages/homepage';
import Modifypwd from './pages/modifypwd';
import Board from './pages/board';
import post from './pages/post';
import myPosts from './pages/myPosts';

export default class Routing extends React.Component {
  render() {
      return (
        <Router >
          <div>
            {/*index.js不做任何界面渲染，只引入跳转路径，初始界面为/（homepage），使用‘exact’防止NavigateBar界面的重复渲染*/}
            <Route exact path="/" component={HomePage} />
            <Route path="/callback" component={HomePage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/modifypwd" component={Modifypwd}/>
            <Route path="/board/emotion" component={Board}/>
            <Route path="/board/study" component={Board}/>
            <Route path="/board/information" component={Board}/>
            <Route path="/board/intern" component={Board}/>
            <Route path="/post" component={post}/>
            <Route path="/myPosts" component={myPosts}/>
       	  </div>
        </Router>
      );
  }
}

ReactDOM.render(<Routing />, document.getElementById("root"));
