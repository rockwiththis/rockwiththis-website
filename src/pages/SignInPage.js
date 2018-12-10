import React, { Component } from 'react';
import { withCookies } from 'react-cookie';

const SignInPage = class SignInPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.submitSignIn = this.submitSignIn.bind(this);
  }

  handleChange = fieldName => event => (
      this.setState({ [fieldName]: event.target.value })
  );

  submitSignIn = event => {
    event.preventDefault();
    const { cookies } = this.props;

    const request = new Request(
      "http://localhost:9292/api/user/signin", {
      method: "POST",
      body: JSON.stringify({ 
        username: this.state.username,
        password: this.state.password
      })
    });

    fetch(request)
      .then(response => response.json())
      .then(data => {
        console.log(data);

        if (!!data.error) {
          this.setState({ error: data.error });

        } else if (!!data.sessionKey) {
          cookies.set("session-key", data.sessionKey);
          window.location = "/admin";

        } else {
          this.setState({ error: "Unexpected Server Error" });
        }
        return;
      });
  }

  render() {
    return (
      <div className="sign-in-form">
        <h1>Sign In</h1>
        <form onSubmit={this.submitSignIn}>
          <input type="text" placeholder="Username" onChange={this.handleChange("username")} />
          <input type="password" placeholder="Password" onChange={this.handleChange("password")} />
          <input type="submit" value="Submit" />
        </form>
        <p className="error">{this.state.error}</p>
      </div>
    )
  }
}

export default withCookies(SignInPage);
