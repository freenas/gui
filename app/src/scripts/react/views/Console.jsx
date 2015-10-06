// CONSOLE
// =======
// Web version of the FreeNAS console.

"use strict";

import React from "react";

import SS from "../../flux/stores/ShellStore";
import SM from "../../flux/middleware/ShellMiddleware";

import Shell from "../components/Shell";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Console/Console.less" );

export default class Console extends React.Component {

  constructor ( props ) {
    super( props );

    this.state =
      { currentShell : "/usr/local/bin/cli"
      , shells       : []
      }
  }

  componentDidMount () {
    SS.addChangeListener( this.handleChangedSS.bind( this ) );
    SM.requestAvailableShells();
  }

  componentWillUnmount () {
    SS.removeChangeListener( this.handleChangedSS.bind( this ) );
  }

  handleChangedSS () {
    this.setState({ shells: SS.shells });
  }

  render () {
    return (
      <main className="console">
        <h1 className="view-header section-heading">
          <span className="text">FreeNAS Console</span>
        </h1>

        <Shell shellType={ this.state.currentShell } />

      </main>
    );
  }

}
