import React, { Component } from 'react'

class Userbar extends Component {

  constructor(props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout() {
    fetch('/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }}).then(() => {
        this.props.changeStatus(false, "")
      }).catch((e) => console.log(e))
  }

  render() {
    return(
      <div>
        <h2>Hello {this.props.nickname}</h2>
        <button onClick={this.logout}>Logout</button>
      </div>
    )
  }
}

export default Userbar
