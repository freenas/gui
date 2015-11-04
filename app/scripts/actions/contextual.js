// CONTEXTUAL ACTION CREATORS
// ==========================

"use strict";

import * as TYPES from "./actionTypes";
import * as ELEMENTS from "../constants/ContextualElements";
import * as DOCS from "../docs";

export function requestContext ( element ) {
  if ( ELEMENTS.hasOwnProperty( element ) ) {
    return (
      { type: TYPES.REQUEST_CONTEXT
      , payload: { activeElement: element }
      }
    );
  } else {
    console.warn( `Could not find element "${ element }"` );
  }
}

export function releaseContext ( element ) {
  if ( ELEMENTS.hasOwnProperty( element ) ) {
    return (
      { type: TYPES.RELEASE_CONTEXT
      , payload: { toRelease: element }
      }
    );
  } else {
    console.warn( `Could not find element "${ element }"` );
  }
}

export function setDocsSection ( section ) {
  if ( DOCS.hasOwnProperty( section ) ) {
    return (
      { type: TYPES.SET_DOCS_SECTION
      , payload: { activeDocs: section }
      }
    );
  } else {
    console.warn( `Could not find docs for "${ section }"` );
  }
}

export function unsetDocsSection ( section ) {
  return { type: TYPES.UNSET_DOCS_SECTION };
}
