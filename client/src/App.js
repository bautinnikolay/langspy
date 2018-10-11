import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
      login: "",
      password: "",
      nickname: "",
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handlePass = this.handlePass.bind(this)
    this.submitLogin = this.submitLogin.bind(this)
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

  submitLogin(event) {
    event.preventDefault()
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.login,
        password: this.state.password,
        nickname: 'testboy',
        locale: 'ru'
      })
    }).then((res) => {
      return res.json()
    }).then((data) => {
      this.setState({isLogin: true, login: '', password: '', nickname: data.nickname})
    })
  }

  handleLogin(event) {
    this.setState({login: event.target.value})
  }

  handlePass(event) {
    this.setState({password: event.target.value})
  }

  render() {
    if(this.state.isLogin) {
      return (
        <div className="app">
          <h2>Hello {this.state.nickname}</h2>
        </div>
      )
    } else {
      return (
        <div className="App">
            <form onSubmit={this.submitLogin}>
              <label>
                Email:
                <input type="text" value={this.state.login} onChange={this.handleLogin} />
              </label>
              <label>
                Password:
                <input type="password" value={this.state.password} onChange={this.handlePass} />
              </label>
              <input type="submit" value="Log in" />
            </form>
        </div>
      );
    }
  }
}

export default App;
