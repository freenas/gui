// EVENTS FEED
// ==========
// Show recent system event history.

"use strict";

import React from "react";
import moment from "moment";

import Disclosure from "../../../components/Disclosure";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Events.less" );


export default class Events extends React.Component {
  createEvent ( eventData, index ) {
    return (
      <Disclosure
        key             = { index }
        headerShow      = { eventData.name }
        headerHide      = { eventData.name }
        defaultExpanded = { false }
      >
        <div className = "event" >
          { moment( eventData.timestamp * 1000 ).format( "L, h:mm:ss a" ) }
        </div>
      </Disclosure>
    );
  }

  render () {
    const EVENTS = this.props.events;

    return (
      <div className="events-feed">
        <h4 className="news-feed-header">{ "System Events" }</h4>
        <div className="event-feed-content">
          { EVENTS.map( this.createEvent ) }
        </div>
      </div>
    );
  }
};

Events.propTypes =
  { events: React.PropTypes.array
  };
