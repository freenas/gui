// Option Flags Debug Tab
// ======================

"use strict";

import React from "react";
import { Row, Col } from "react-bootstrap";

import ToggleSwitch from "../../components/ToggleSwitch";

var Options = React.createClass({

  getInitialState: function () {
      return (
        { MIDDLEWARE_CLIENT_DEBUG:
          { connection     : false
          , authentication : false
          , packing        : false
          , logging        : false
          , queues         : false
          , subscriptions  : false
          , messages       : false
          }
        , REACT_ERRORS:
          { setState: false
          }
        }
      );
    }

  , componentDidMount: function () {
      window.DEBUG_FLAGS = this.state;
    }

  , componentWillUnmount: function () {
      window.DEBUG_FLAGS = null;
    }

  , componentDidUpdate: function ( prevProps, prevState ) {
      window.DEBUG_FLAGS = this.state;
    }

  , toggleSetStateWarnings () {
      let { REACT_ERRORS } = this.state;

      if ( REACT_ERRORS.setState ) {
        console.log( "DEBUG: Toggling setState shim not currently available. Please reload the page." );
      } else {
        let warn = console.warn;

        console.warn = function( warning ) {
          if ( /(setState)/.test( warning ) ) {
            throw new Error( warning );
          }
          warn.apply( console, arguments );
        };

        REACT_ERRORS.setState = true;

        console.log( "DEBUG: React setState violations have been shimmed." );
      }

      this.setState({ REACT_ERRORS });
    }

  , unshimSetStateWarnings () {
    }

  , handleFlagToggle: function ( flag ) {
      var tempFlags = this.state.MIDDLEWARE_CLIENT_DEBUG;

      tempFlags[ flag ] = !tempFlags[ flag ];

      this.setState({
        MIDDLEWARE_CLIENT_DEBUG: tempFlags
      });
    }

  , createMiddlewareFlag: function ( flag, label, description ) {
      return (
        <Row>
          <Col xs={3} className="text-center">
            <h6>{ label }</h6>
            <ToggleSwitch
              sm
              toggled   = { this.state.MIDDLEWARE_CLIENT_DEBUG[ flag ] }
              onChange  = { this.handleFlagToggle.bind( null, flag ) } />
          </Col>

          <Col xs={9} className="debug-options-label">
            <p>{ description }</p>
          </Col>
        </Row>
      );
    }

  , render: function () {

    return (
      <div className="debug-content-flex-wrapper debug-options">

        <Col xs={6} className="debug-column" >

          <h5 className="debug-heading">Middleware Debug Message Flags</h5>
          <div className="debug-column-content well well-sm">
            { this.createMiddlewareFlag(
                  "connection"
                , "Middleware Connection"
                , "Events and information about the state of all clients' connections to the FreeNAS Middleware Server, including disconnection events."
            ) }
            <hr />
            { this.createMiddlewareFlag(
                  "authentication"
                , "Client Authentication"
                , "Events regarding the authentication status of connected clients."
            ) }
            <hr />
            { this.createMiddlewareFlag(
                  "packing"
                , "Request Packing"
                , "'Packing' is the process of encoding a JSON-formatted object to send to the Middleware Server. Includes the resulting pack, or an error dump outlining reasons for an encoding failure."
            ) }
            <hr />
            { this.createMiddlewareFlag(
                  "logging"
                , "Pending and Logged Requests"
                , "A 'logged' request is a middleware request that was sent to the server, stored in the private `pendingRequests` object. These are eventually resolved and removed, either by a response from the server, or a timeout."
            ) }
            <hr />
            { this.createMiddlewareFlag(
                  "queues"
                , "Queued Requests"
                , "Many views' lifecycle will make a request before the connection is made, and before the login credentials have been accepted. These requests are enqueued by the `login` and `request` functions into the `queuedActions` object and `queuedLogin`, and then are dequeued once a valid authorization event has occurred."
            ) }
            <hr />
            { this.createMiddlewareFlag(
                  "subscriptions"
                , "Subscription Events"
                , "Subscribe and unsubscribe events, as well as information about the logged number of active subscriptions, and their trends."
            ) }
            <hr />
            { this.createMiddlewareFlag(
                  "messages"
                , "Message Events"
                , "General message events from the Middleware Server."
            ) }
          </div>

        </Col>

        <Col xs={6} className="debug-column" >

          <h5 className="debug-heading">Webapp Debugging</h5>
          <div className="debug-column-content well well-sm">
            <Row>
              <Col xs={3} className="text-center">
                <h6>{"setState() no-ops"}</h6>
                <ToggleSwitch
                  sm
                  toggled   = { this.state.REACT_ERRORS.setState }
                  onChange  = { this.toggleSetStateWarnings } />
              </Col>

              <Col xs={9} className="debug-options-label">
                <p>{"Force setState no-op warning to cause a stack trace"}</p>
              </Col>
            </Row>
            <hr />
          </div>
        </Col>
      </div>
    );
  }

});

module.exports = Options;
