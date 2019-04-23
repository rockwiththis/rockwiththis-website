import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setInitialSongs } from 'actions/fetch/songs';
import TestControls from 'components/audio-manager/test-controls';

const propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setInitialSongs: PropTypes.func.isRequired,
}

class TestPage extends React.Component {

  componentWillMount = () =>
    this.props.setInitialSongs();

  render = () =>
    <div id="test-page">
      { this.props.songs.length > 0 ?
          <TestControls songs={this.props.songs} /> :
          <p>loading songs...</p>
      }
    </div>;
}

TestPage.propTypes = propTypes;

export default connect(
  ({ filteredPosts }) => ({ songs: filteredPosts }),
  { setInitialSongs }
)(TestPage);
