// APPCAFE
// ========
// Simple wrapper for AppCafe

"use strict";

import React from "react";
import { connect } from "react-redux";


// STYLESHEET
if ( process.env.BROWSER ) require( "./AppCafe.less" );


// REACT
class AppCafe extends React.Component {
  render () {
    return (
      <main className="appcafe">
        <h1 className="view-header section-heading type-line">
          <span className="text">AppCafe</span>
        </h1>

        <iframe src={ "//" + this.props.host + ":8885" } />
      </main>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return { host: state.websocket.host };
}

function mapDispatchToProps ( dispatch ) {
  return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( AppCafe );
