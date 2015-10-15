// SESSION INTERRUPT DIALOG - VIEW
// ===============================
// This dialog is shown for a variety of reasons, all of which having to do with
// the GUI entering a "disconnected" state. This dialog is visible when no
// WebSocket connection exists, and may indicate to the user that their session
// has expired.

"use strict";

import React from "react";

// STYLESHEET
if ( process.env.BROWSER ) require( "./PrimaryNavigation.less" );


export default class SessionInteruptDialog extends React.Component {
  render () {
    console.log( this.props );
    return <div>POOP</div>
  }
}
