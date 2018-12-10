import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

const AdminPage = class AdminPage extends Component {

  constructor(props) {
    console.log(props);
    super(props);
    const { cookies } = props;
    this.state = {
      sessionKey: cookies.get('session-key')
    };
  }

  render() {
    if (!this.state.sessionKey) return <Redirect to="/signin" />
    else return <p>You are signed in!</p>
  }
}

export default withCookies(AdminPage);
