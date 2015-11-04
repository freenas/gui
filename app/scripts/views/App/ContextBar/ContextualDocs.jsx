// CONTEXTUAL DOCUMENTATION
// ========================

"use strict";

import React from "react";

import * as DOCS from "../../../docs";

const ContextualDocs = ( props ) => {

  if ( props.section && DOCS[ props.section ] ) {
    return (
      <div className={ "context-content" }>
        { DOCS[ props.section ] }
      </div>
    );
  } else {
    return (
      <div className={ "context-content" }>
        <p className="text-center">Could not load docs!</p>
      </div>
    );
  }

}

ContextualDocs.propTypes =
  { section: React.PropTypes.string.isRequired
  };

export default ContextualDocs;
