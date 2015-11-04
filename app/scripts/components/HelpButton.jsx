// HELP BUTTON
// ===========
// Used to request docs and/or help

"use strict";

import React from "react";
import { Button } from "react-bootstrap";
import classnames from "classnames";

import * as DOCS from "../docs";


// STYLESHEET
if ( process.env.BROWSER ) require( "./HelpButton.less" );


// REACT
const HelpButton = ( props ) => {
  if ( !Boolean( DOCS[ props.docs ] ) ) {
    console.warn( `Section "${ props.docs }" was not found in docs` );
    return null;
  }

  const IS_ACTIVE = props.docs === props.activeDocs

  return (
    <Button
      active = { IS_ACTIVE }
      onClick = { ( event ) =>
        { IS_ACTIVE
        ? props.releaseDocs( props.docs )
        : props.requestDocs( props.docs )
        }
      }
      bsStyle = "link"
      className = { classnames( "btn-help", props.className ) }
    >
    ?
    </Button>
  );
}

HelpButton.propTypes =
  { docs: React.PropTypes.string.isRequired
  , activeDocs: React.PropTypes.string.isRequired
  , requestDocs: React.PropTypes.func.isRequired
  , releaseDocs: React.PropTypes.func.isRequired
  };

export default HelpButton;
