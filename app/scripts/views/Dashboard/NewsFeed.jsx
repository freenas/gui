// News Feed
// =========
// Display active tasks and recent events in a feed format.

"use strict";

import React from "react";

import TM from "../../flux/middleware/TasksMiddleware";
import TS from "../../flux/stores/TasksStore";

import Tasks from "./NewsFeed/Tasks";

// STYLESHEET
if ( process.env.BROWSER ) require( "./NewsFeed/NewsFeed.less" );


export default class NewsFeed extends React.Component {
  constructor ( props ) {
    super( props );

    // this.onChangeES = this.handleChangedES.bind( this );
    // this.onChangeTS = this.handleChangedTS.bind( this );

    this.displayName = "NewsFeed";
    this.state =
      { tasks  : TS.tasks
      , events : ES.events
      };
  }

  // componentDidMount () {
  //   ES.addChangeListener( this.onChangeES );
  //   TS.addChangeListener( this.onChangeTS );

  //   TM.subscribe( this.displayName );

  //   EM.requestEvents();
  //   TM.requestAllTasks();
  // }

  // componentWillUnmount () {
  //   ES.removeChangeListener( this.onChangeES );
  //   TS.removeChangeListener( this.onChangeTS );

  //   TM.unsubscribe( this.displayName );
  // }

  // handleChangedES () {
  //   this.setState({ events: ES.events });
  // }

  // handleChangedTS () {
  //   this.setState({ tasks: TS.tasks });
  // }

  render () {
    return (
      <div className = "news-feed">
        <Tasks tasks={ this.state.tasks } />
      </div>
    );
  }
}
