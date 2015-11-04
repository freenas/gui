// CONTEXTUAL ELEMENTS - REDUCER
// =============================

"use strict";

import * as TYPES from "../actions/actionTypes";
import * as CONTEXTUAL from "../constants/ContextualElements";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { activeElement: ""
  , activeDocs: ""
  , elementQueue: new Set()
  };

export default function contextual ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    case TYPES.REQUEST_CONTEXT:
      return Object.assign( {}, state,
        { activeElement: payload.activeElement
        }
      );

    case TYPES.RELEASE_CONTEXT:
      return Object.assign( {}, state,
        { activeElement: ""
        }
      );

    case TYPES.SET_DOCS_SECTION:
      return Object.assign( {}, state, { activeDocs: payload.activeDocs } );

    case TYPES.UNSET_DOCS_SECTION:
      return Object.assign( {}, state, { activeDocs: "" } );

    default:
      return state;
  }
}
