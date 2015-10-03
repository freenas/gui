// News Feed
// =========
// Display active tasks and recent events in a feed format.

"use strict";

import React from "react";

import EM from "../../../flux/middleware/EventsMiddleware";
import TM from "../../../flux/middleware/TasksMiddleware";
import ES from "../../../flux/stores/EventsStore";
import TS from "../../../flux/stores/TasksStore";

import Tasks from "./NewsFeed/Tasks";
import Events from "./NewsFeed/Events";

// STYLESHEET
if ( process.env.BROWSER ) require( "./NewsFeed/NewsFeed.less" );

export default class NewsFeed extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "NewsFeed";
    this.state =
      { tasks  : TS.tasks
      , events : ES.events
      };
  }

  componentDidMount () {
    ES.addChangeListener( this.handleChangedES.bind( this ) );
    TS.addChangeListener( this.handleChangedTS.bind( this ) );

    TM.subscribe( this.displayName );

    EM.requestEvents();
    TM.requestAllTasks();
  }

  componentWillUnmount () {
    ES.removeChangeListener( this.handleChangedES.bind( this ) );
    TS.removeChangeListener( this.handleChangedTS.bind( this ) );

    TM.unsubscribe( this.displayName );
  }

  handleChangedES () {
    this.setState({ events: ES.events });
  }

  handleChangedTS () {
    this.setState({ tasks: TS.tasks });
  }

  render () {
    return (
      <div className = "tasks-sidebar">
        <Tasks tasks={ this.state.tasks } />
        <Events events={ this.state.events } />
      </div>
    );
  }
}
