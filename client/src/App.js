import React, { Component } from 'react';
import './App.css';
import Registerform from './components/registerform'
import Loginform from './components/loginform'
import Userbar from './components/userbar'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
      nickname: "",
    }

    this.changeStatus = this.changeStatus.bind(this)
  }

  componentDidMount() {
    fetch('/getme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      return res.json()
    }).then((data) => {
      if(data.userInfo) {
        this.setState({isLogin: true, nickname: data.userInfo.nickname})
      }
    }).catch((e) => console.log(e))
  }

  changeStatus(login, nickname) {
    this.setState({isLogin: login, nickname: nickname})
  }

  render() {
    const isLogin = this.state.isLogin
    return (
      <div>
      {isLogin ? (
        <Userbar nickname={this.state.nickname} changeStatus={this.changeStatus} />
      ) : (
        <div>
          <Registerform changeStatus={this.changeStatus}/>
          <Loginform changeStatus={this.changeStatus}/>
        </div>
      )}
      </div>
    )
  }
}

export default App;
