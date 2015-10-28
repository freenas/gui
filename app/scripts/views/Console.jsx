// CONSOLE
// =======
// Web version of the FreeNAS console.

"use strict";

import React from "react";
import { connect } from "react-redux";

import * as ACTIONS from "../actions/shells";

import Shell from "../components/Shell";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Console/Console.less" );


class Console extends React.Component {
  render () {
    return (
      <main className="console">
        <h1 className="view-header section-heading">
          <span className="text">FreeNAS Console</span>
        </h1>

        <Shell
          spawnShell = { this.props.spawnShell }
          token = { this.props.shells.token }
          shellType  = "/usr/local/bin/cli"
        />

      </main>
    );
  }

}


// REDUX
function mapStateToProps ( state ) {
  return ({ shells: state.shells });
}

function mapDispatchToProps ( dispatch ) {
  return (
    { fetchShells: () => dispatch( ACTIONS.fetchShells() )
    , spawnShell: ( shellType ) => dispatch( ACTIONS.spawnShell( shellType ) )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Console );
