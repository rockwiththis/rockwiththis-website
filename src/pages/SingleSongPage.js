import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import SingleSong from 'components/SingleSong/SingleSong';
import RelatedSongs from 'components/RelatedSongs/RelatedSongs';
import SingleSongPlaceholder from 'components/SingleSongPlaceholder/SingleSongPlaceholder';

// TODO propTypes

class SingleSongPage extends Component {

  getSongId = (props = this.props) => parseInt(props.match.params.id);

  componentWillMount = () =>
    this.props.actions.fetchSingleSong(this.getSongId());

  shouldComponentUpdate = nextProps => {
    const loadSongId = this.getSongId(nextProps);
    if (loadSongId != this.getSongId())
      this.props.actions.fetchSingleSong(loadSongId);

    return true
  }

  render = () => (
      <div className="singleSongPage page">
        { !!this.props.singleSong && this.props.singleSong.id === this.getSongId()
          ?
          <Fragment>
            <div className="singleSongContainer">
              <SingleSong {...this.props} />
            </div>
            <RelatedSongs {...this.props} />
          </Fragment>
          :
          <SingleSongPlaceholder />
        }
      </div>
  );
}

export default SingleSongPage
