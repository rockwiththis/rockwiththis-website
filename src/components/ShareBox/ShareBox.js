import React, { Component } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
  WhatsappIcon
} from 'react-share';

import './ShareBox.scss'

class ShareBox extends Component {

  constructor(props) {
      super(props)


      this.state = {
        showSharePopup: false
      }

      this.showsharePopup = this.showsharePopup.bind(this);
      this.closesharePopup = this.closesharePopup.bind(this);
  }


  showsharePopup(event) {
    event.preventDefault();

    this.setState({
      showSharePopup: true,
    });

    document.addEventListener('click', this.closesharePopup);
  }

  closesharePopup() {
      this.setState({ showSharePopUp: false }, () => {
        document.removeEventListener('click', this.closesharePopup);
      });

}

    render() {

      const {
          song
      } = this.props

        const url = 'https://rockwiththis.com'


        return (

          <div className="ShareBox">
          <button onClick={this.showsharePopup} className="shareshareButton"><i className="im im-paperplane"></i></button>


          {
            this.state.showSharePopup
              ? (
                <div
                  className="sharePopup"
                  ref={(element) => {
                    this.sharePopup = element;
                  }}
                >
                    <p>Share </p>
                    <FacebookShareButton url={url}>
                      <FacebookIcon size={40} round={true} />
                    </FacebookShareButton>
                    <TwitterShareButton url={url}>
                      <TwitterIcon size={40} round={true} />
                    </TwitterShareButton>
                    <EmailShareButton url={url}>
                      <EmailIcon size={40} round={true} />
                    </EmailShareButton>
                    <a className="smsLink" href="sms:?body=Rock with this song"><img src="http://www.rockwiththis.com/wp-content/uploads/2018/06/iconmonstr-sms-1-240.png" /></a>
                </div>
              )
              : (
                null
              )
          }
          </div>
        )
    }
}


export default ShareBox
