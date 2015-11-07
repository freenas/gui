// EVENTS
// ======
// Controller component for rendering toast notifications

"use strict";

import _ from "lodash";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { TransitionMotion, spring } from "react-motion";

import * as TYPES from "../../actions/actionTypes";
import * as EVENTS from "../../actions/events";

import Notification from "./Events/Notification";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Events.less" );


// REACT
class Events extends React.Component {

  getDefaultValues () {
    let configs = {};
    this.props.timeline.forEach( id => {
      configs[ id ] =
        { height: spring(0)
        , opacity: spring(0)
        , translate: spring(0)
        , data: this.props.events[ id ]
        }
    });

    return configs;
  }

  getEndValues () {
    let configs = {};
    this.props.timeline.forEach( id => {
      configs[ id ] =
        { height: spring(1)
        , opacity: spring(1)
        , translate: spring(0)
        , data: this.props.events[ id ]
        }
    });

    return configs;
  }

  willEnter ( id ) {
    return (
      { height: spring(0)
      , opacity: spring(1)
      , translate: spring(0)
      , data: this.props.events[ id ]
      }
    );
  }

  willLeave ( id, justUnmounted ) {
    return (
      { height: spring(0)
      , opacity: spring(0)
      , translate: spring(1)
      , data: justUnmounted.data
      }
    );
  }

  render () {
    return (
      <TransitionMotion
        defaultStyles = { this.getDefaultValues() }
        styles = { this.getEndValues() }
        willEnter = { this.willEnter.bind( this ) }
        willLeave = { this.willLeave.bind( this ) }
      >
      { interpolatedStyles =>
        <div
          className = "notification-feed"
          onMouseEnter = { () => this.props.freezeNotifications() }
          onMouseLeave = { () => this.props.unfreezeNotifications() }
        >
          { Object.keys( interpolatedStyles ).map( ( id, index ) => {
            const { data, ...style } = interpolatedStyles[ id ];
            return (
              <Notification
                key = { index }
                style = { style }
                text = { data.text }
                icon = { data.icon }
                bsStyle = { data.bsStyle }
                clientTimestamp = { data.clientTimestamp }
              />
            );
          })}
        </div>
      }
      </TransitionMotion>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  const TIMELINE = state.events.timeline;
  const EVENTS = state.events.events;
  const TO_RENDER = [];

  for ( let i = 0; i < TIMELINE.length; i++ ) {
    if ( EVENTS[ TIMELINE[i] ] && !EVENTS[ TIMELINE[i] ].isStale ) {
      TO_RENDER.push( TIMELINE[i] );
    } else {
      break;
    }
  }

  return (
    { timeline: TO_RENDER
    , events: EVENTS
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    { freezeNotifications: () =>
      dispatch( EVENTS.freezeNotifications() )
    , unfreezeNotifications: () =>
      dispatch( EVENTS.unfreezeNotifications() )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Events );
