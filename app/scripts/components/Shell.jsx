// SHELL
// =====
// Common-use React component wrapping the various different shells that FreeNAS
// supports. Handles its own lifecycle and does not rely on a Flux store. Since
// it relies on single-use authentication tokens and has no persistent data,
// there is no need for the standard data flow model.

"use strict";

import React from "react";
import Terminal from "term.js";

import TargetHost from "../websocket/TargetHost";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Shell.less" );


// REACT
export default class Shell extends React.Component {

  constructor ( props ) {
    super( props );

    this.ws = null;
    this.term = null;
  }

  componentDidMount () {
    this.props.spawnShell( this.props.shellType );
  }

  componentWillUnmount () {
    this.destroyShell();
  }

  shouldComponentUpdate () {
    return false;
  }

  calculateDimensions () {
    let columns = 80;
    let rows = 40;

    if ( this.refs.termTarget ) {
      const AVAILABLE_HEIGHT = this.refs.termTarget.clientHeight;
      const ROW_HEIGHT = this.refs.termTarget
                             .querySelector( ".terminal > div" )
                             .clientHeight;

      if ( AVAILABLE_HEIGHT && ROW_HEIGHT ) {
        rows = Math.floor( AVAILABLE_HEIGHT / ROW_HEIGHT );
      }
    }

    return [ columns, rows ];
  }

  componentWillReceiveProps ( nextProps ) {
    const TOKEN_CHANGED = nextProps.token !== this.props.token;
    const SHELL_CHANGED = nextProps.shellType !== this.props.shellType;

    if ( SHELL_CHANGED ) {
      nextProps.spawnShell( nextProps.shellType );
    }

    if ( nextProps.token && ( !this.ws || !this.term || TOKEN_CHANGED ) ) {
      this.createNewShell( nextProps.token );
    }

    if ( this.term && this.refs.termTarget.clientHeight !== 0 ) {
      const dimensions = this.calculateDimensions();
      this.term.resize( dimensions[0], dimensions[1] );
    }
  }

  destroyShell () {
    if ( this.ws ) this.ws.close();
    if ( this.term ) this.term.destroy();

    this.ws = null;
    this.term = null;
  }

  createNewShell ( token ) {
    let connection = TargetHost.connection();
    let url = connection.protocol + connection.host + ":5000/shell";

    // Clean up any previous shells
    this.destroyShell();

    this.ws = new WebSocket( url );
    this.term = new Terminal({ cols       : 80
                             , rows       : 14
                             , screenKeys : true
    });

    this.ws.onopen = ( event ) => {
      this.ws.send( JSON.stringify({ token }) );
    }

    this.ws.onmessage = ( event ) => {
      let eventData;

      try {
        eventData = JSON.parse( event.data );

        if ( eventData ) {
          return;
        }
      } catch ( error ) {
        // This is only here to make sure that no JSON information is
        // inadvertently rendered into the terminal.
      }

      let reader = new FileReader();
      reader.onload = () => this.term.write(reader.result);
      reader.readAsBinaryString(event.data);
    }

    this.term.on( "data", ( data ) => this.ws.send( data ) );

    this.term.open( this.refs.termTarget );
  }

  render () {
    return <div className="termFlex" ref="termTarget" />;
  }

}

Shell.propTypes =
  { shellType: React.PropTypes.string
  , token: React.PropTypes.string
  , spawnShell: React.PropTypes.func.isRequired
  };

Shell.defaultProps =
  { shellType: "/bin/sh"
  };
