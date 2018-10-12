import React, { Component } from 'react'

class Registerform extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      nickname: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.submitRegister = this.submitRegister.bind(this)
  }

  handleInputChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({[name]: value})
  }

  submitRegister(event) {
    event.preventDefault()
    const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        nickname: this.state.nickname,
        locale: language
      })
    }).then((res) => {
      return res.json()
    }).then((data) => {
      this.props.changeStatus(true, data.nickname)
    }).catch((e) => console.log(e))
  }

  render() {
    return(
      <div>
        <h2>Регистрация</h2>
        <form onSubmit={this.submitRegister}>
          <div>
            <label>
              Email:
              <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} required/>
            </label>
          </div>
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
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
    )
  }
}

export default Registerform
