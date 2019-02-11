import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import HeroPosts from 'components/HeroGrid/HeroPosts';
import DiscoverSection from 'components/discover';

import { resetSongs } from 'actions/fetch/songs';

const propTypes = {
  mainScrollPos: PropTypes.number,
  discoverScrollPos: PropTypes.number,

  // TODO once it won't cause a fuckton of re-rendering, set redux state instead
  setMainScrollPos: PropTypes.func.isRequired,
  setDiscoverScrollPos: PropTypes.func.isRequired,

  // Redux
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchInitialSongs: PropTypes.func.isRequired
}

class Homepage extends Component {

  componentWillMount = () => {
    if (this.props.songs.length === 0)
      this.props.actions.fetchPosts();
  }

  componentDidMount = () => {
    window.scrollTo(0, this.mainPageScroll);
    window.addEventListener('scroll', this.setMainScrollPos);
  }

  componentWillUnmount = () =>
    window.removeEventListener('scroll', this.setMainScrollPos);

  setMainScrollPos = () => this.props.setMainScrollPos(window.scrollY);

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
            <HeroPosts
              {...this.props}
              heroPosts={this.props.heroPosts}
            />

            <DiscoverSection
              discoverScrollPos={this.props.discoverScrollPos}
              setDiscoverScrollPos={this.props.setDiscvoerScrollPos}
            />
          </div>
        </Fragment>
    )
  }
}

Homepage.propTypes = propTypes;

export default connect(
  ({ filteredPosts }) => ({ songs: filteredPosts }),
  { fetchInitialSongs: resetSongs }
)(Homepage)
