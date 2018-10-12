import React, { Component } from 'react'

class Loginform extends Component {

  constructor(props) {
    super(props)
    this.state = {
      password: "",
      nickname: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.submitLogin = this.submitLogin.bind(this)
  }

  handleInputChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({[name]: value})
  }

  submitLogin(event) {
    event.preventDefault()
    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: this.state.password,
        nickname: this.state.nickname
      })
    }).then((res) => {
      return res.json()
    }).then((data) => {
      this.props.changeStatus(true, data.nickname)
    }).catch()
  }

  render() {
    return(
      <div>
        <h2>Авторизация</h2>
        <form onSubmit={this.submitLogin}>
          <div>
            <label>
              Nickname:
              <input type="text" name="nickname" value={this.state.nickname} onChange={this.handleInputChange} required/>
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} required/>
            </label>
          </div>
          <div>
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    )
  }
}

export default Loginform
