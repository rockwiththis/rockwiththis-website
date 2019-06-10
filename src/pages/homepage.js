import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import NewestSongs from 'components/newest-songs';
import DiscoverSection from 'components/discover';
import AutoplayErrorModal from 'components/autoplay-error-modal';

import { setInitialSongs } from 'actions/fetch/songs';
import { setMainScroll } from 'actions/scroll';
import { didAutoplayFail } from 'actions/set-state';

const propTypes = {
  // Redux
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setInitialSongs: PropTypes.func.isRequired,
  didAutoplayFail: PropTypes.func.isRequired
  // mainScrollPos: PropTypes.number.isRequired,
  // setMainScroll: PropTypes.func.isRequired
}

class Homepage extends Component {

  componentWillMount = () => {
    if (this.props.songs.length === 0)
      this.props.setInitialSongs();

    if (this.props.showAutoplayModal)
      this.props.didAutoplayFail(true);
  }

  /* TODO come up w/ better scroll anchoring solution

  componentDidMount = () => {
    window.addEventListener('scroll', this.reportMainScrollPos);
    this.updateScroll();
  }

  componentWillUnmount = () =>
    window.removeEventListener('scroll', this.reportMainScrollPos);

  componentDidUpdate = () => this.updateScroll;

  reportMainScrollPos = () => this.props.setMainScroll(window.scrollY);

  updateScroll = () => window.scrollTo(0, this.props.mainScrollPos);

  */

  render() {
    return (
        <Fragment>
          <Helmet>
            <title>Rock With This</title>
              <meta name="description" content="We don't have every song...just the best you haven't heard." />
              <meta name="keywords" content="Music Discovery Curation" />
              <meta name="application-name" content="ROCKWITHTHIS" />
              <meta name="theme-color" content="#e162f8" />
              <meta property="og:url" content="http://www.rockwiththis.com/" />
              <meta property="og:title" content="Rock With This" />
              <meta property="og:description" content="We don't have every song. Just the best you haven't heard." />
              <meta property="og:image" content="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-1/p200x200/49844120_667342663682594_5822783533663387648_n.jpg?_nc_cat=104&_nc_ht=scontent-sjc3-1.xx&oh=e0a0be17100a25cf00020b625ecb52cc&oe=5CC6B728" />
              <meta property="og:image:url" content="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-1/p200x200/49844120_667342663682594_5822783533663387648_n.jpg?_nc_cat=104&_nc_ht=scontent-sjc3-1.xx&oh=e0a0be17100a25cf00020b625ecb52cc&oe=5CC6B728" />
          </Helmet>

          <div className="homeContainer">
            <NewestSongs
              {...this.props}
              heroPosts={this.props.heroPosts}
            />

            <DiscoverSection />

            <AutoplayErrorModal showModalOverride={this.props.showAutoplayModal} />
          </div>
        </Fragment>
    )
  }
}

Homepage.propTypes = propTypes;

export default connect(
  ({ filteredPosts }) => ({ songs: filteredPosts }),
  { setInitialSongs, didAutoplayFail }
)(Homepage)
