import React, { Component } from 'react'
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

         const url = `http://rockwiththis-staging.com/songs/${this.props.song.id}`


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
                  <div className="song-info">
                    <p className="song-name">{song.name}</p>
                    <p className="artist-name">{song.artist_name}</p>
                  </div>

                </div>
                <div className="shareInfoBottom">
                <p className="share-title">Share this post!</p>


                  <FacebookShareButton url={url}>
                    <FacebookIcon size={40} round={false} />
                  </FacebookShareButton>
                  <TwitterShareButton url={url}>
                    <TwitterIcon size={40} round={false} />
                  </TwitterShareButton>
                  <GooglePlusShareButton url={url}>
                    <GooglePlusIcon size={40} round={false} />
                  </GooglePlusShareButton>
                  <RedditShareButton url={url}>
                    <RedditIcon size={40} round={false} />
                  </RedditShareButton>

                  <EmailShareButton url={url}>
                    <EmailIcon size={40} round={false} />
                  </EmailShareButton>
                  <a className="smsLink" href="sms:?body=Rock with this song"><img src="http://www.rockwiththis.com/wp-content/uploads/2018/06/iconmonstr-sms-1-240.png" /></a>
                  <form><input value={url} readonly /> </form>
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
