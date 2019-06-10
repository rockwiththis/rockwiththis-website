import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip'

import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappShareButton,
  GooglePlusShareButton,
  RedditShareButton,
  TumblrShareButton,
  PinterestShareButton,
  GooglePlusIcon,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  PinterestIcon
} from 'react-share';

import './ShareBox.scss'

const smsImage = 'images/sms.png';

class ShareBox extends Component {

  constructor(props) {
      super(props)


      this.state = {
        showSharePopup: false,
        value: `http://rockwiththis.com/songs/${this.props.song.id}`,
        copied: false,
      }

      this.showsharePopup = this.showsharePopup.bind(this);
      this.closesharePopup = this.closesharePopup.bind(this);
  }


  showsharePopup(event) {
    event.preventDefault();

    this.setState({
      showSharePopup: true,
    });

    // document.addEventListener('click', this.closesharePopup);
  }

  closesharePopup(event) {
    event.preventDefault();

    this.setState({
      showSharePopup: false,
    });
    // document.addEventListener('click', this.showsharePopup);


}

onCopyUrl() {
  this.setState({copied: true})
  setTimeout(function(){
             this.setState({copied: false});
  }.bind(this),2000);
}

    render() {

      const {
          song
      } = this.props

      const textMessage = `sms:?&body=Rock With This Song %0a http://rockwiththis.com/songs/${this.props.song.id}`


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
                <div className="shareInfoTop">
                  <img className="sharePreviewImg" src={song.image_url} />
                  <p className="closeSharePopup" onClick={this.closesharePopup}><i class="far fa-times-circle"></i></p>
                  <div className="song-info">
                  <p className="share-title">Share this post! </p>
                    <p className="song-name">{song.name}</p>
                    <p className="artist-name">{song.artist_name}</p>
                  </div>

                </div>
                <div className="shareInfoBottom">



                  <FacebookShareButton url={this.state.value}>
                    <FacebookIcon size={40} round={false} />
                  </FacebookShareButton>
                  <TwitterShareButton url={this.state.value}>
                    <TwitterIcon size={40} round={false} />
                  </TwitterShareButton>
                  <GooglePlusShareButton url={this.state.value}>
                    <GooglePlusIcon size={40} round={false} />
                  </GooglePlusShareButton>
                  <RedditShareButton url={this.state.value}>
                    <RedditIcon size={40} round={false} />
                  </RedditShareButton>

                  <EmailShareButton url={this.state.value}>
                    <EmailIcon size={40} round={false} />
                  </EmailShareButton>
                  <a className="smsLink" href={textMessage}><img src={smsImage} /></a>


                  <form className="url-clipboard">
                  <CopyToClipboard text={this.state.value}
                    onCopy={() => this.onCopyUrl()}>
                    <input value={this.state.value} readonly/>
                  </CopyToClipboard>
                  <CopyToClipboard text={this.state.value}
                    onCopy={() => this.onCopyUrl()}>
                    <div className="clipboard-icon-container"><i class="fas fa-clipboard"></i></div>
                  </CopyToClipboard>

                  {this.state.copied ? <span className="tooltip" style={{color: 'green'}}>Copied!</span> : null}
                   </form>

                </div>
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
