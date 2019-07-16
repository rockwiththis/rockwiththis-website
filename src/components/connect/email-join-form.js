import React from 'react';
import jsonp from 'jsonp';
import PropTypes from 'prop-types';

class EmailJoinForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  };

  handleSubmit(evt) {
    evt.preventDefault();
    const { fields, action } = this.props;
    const values = fields.map(field => {
      return `${field.name}=${encodeURIComponent(this.state[field.name])}`;
    }).join("&");
    const path = `${action}&${values}`;
    const url = path.replace('/post?', '/post-json?');
    const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
    const email = this.state['EMAIL'];
    (!regex.test(email)) ? this.setState({ status: "empty" }) : this.sendData(url);
  };

  sendData(url) {
    this.setState({ status: "sending" });
    jsonp(url, { param: "c" }, (err, data) => {
      if (data.msg.includes("already subscribed")) {
        this.setState({ status: 'duplicate' });
      } else if (err) {
        this.setState({ status: 'error' });
      } else if (data.result !== 'success') {
        this.setState({ status: 'error' });
      } else {
        this.setState({ status: 'success' });
      };
    });
  }

  render() {
    const { messages, fields, styles, className } = this.props;
    const { status } = this.state;
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="email-join-form">
        {fields.map(input =>
          <input
            onBlur={({ target }) => this.setState({ [input.name]: target.value })}
            placeholder={input.placeholder}
            name={input.name}
            type={input.type}
            defaultValue={this.state[input.name]} />
        )}
        <button className="submit-btn"
          disabled={status === "sending" || status === "success"}
          type="submit"
        >
          JOIN
        </button>
        <div className='msg-alert'>
          {status === "sending" && <p style={styles.sendingMsg}>{messages.sending}</p>}
          {status === "success" && <p style={styles.successMsg}>{messages.success}</p>}
          {status === "duplicate" && <p style={styles.duplicateMsg}>{messages.duplicate}</p>}
          {status === "empty" && <p style={styles.errorMsg}>{messages.empty}</p>}
          {status === "error" && <p style={styles.errorMsg}>{messages.error}</p>}
        </div>

        <style jsx>{`
          .email-join-form {
            margin-top: 15px;
          }
          .email-join-form input {
            height: 40px;
            width: 70%;
            border: 1px solid #0097d5;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
            box-sizing: border-box;
            padding-left: 5px;
          }
          .email-join-form .submit-btn {
            height: 40px;
            width: 30%;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
            box-sizing: border-box;
            background: #0097d5;
            color: #fff;
            font-weight: bold;
            letter-spacing: 1px;
            font-size: 14px;
            cursor: pointer;
          }
          .email-join-form .submit-btn:hover {
            background: #1e0c49;
          }
        `}</style>
      </form>
    );
  }
}

EmailJoinForm.defaultProps = {
  messages: {
    sending: "Sending...",
    success: "Thanks for subscribing to Rock With This!",
    error: "Woops sorry. Try refreshing the page and trying again.",
    empty: "You must write an actual e-mail.",
    duplicate: "You've already subscribed to Rock With This!"
  },
  styles: {
    sendingMsg: {
      color: '#0652DD'
    },
    successMsg: {
      color: '#009432'
    },
    duplicateMsg: {
      color: '#EE5A24'
    },
    errorMsg: {
      color: '#ED4C67'
    }
  }
}

EmailJoinForm.propTypes = {
  action: PropTypes.string,
  messages: PropTypes.object,
  fields: PropTypes.array,
  styles: PropTypes.object,
  className: PropTypes.string
};

export default EmailJoinForm;
