// News Feed
// =========
// Display active tasks and recent events in a feed format.

"use strict";

import React from "react";
import { connect } from "react-redux";

import Tasks from "./NewsFeed/Tasks";

// STYLESHEET
if ( process.env.BROWSER ) require( "./NewsFeed/NewsFeed.less" );


// REACT
class NewsFeed extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "NewsFeed";
  }

  render () {
    return (
      <div className = "news-feed">
        <Tasks tasks={ this.props.tasks } />
      </div>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return { tasks: state.tasks.tasks };
}

export default connect( mapStateToProps )( NewsFeed );
