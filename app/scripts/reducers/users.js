// USERS - REDUCER
// ===============

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { queryUsersRequests: new Set()
  , getNextUIDRequests: new Set()
  , users: []
  , userForm:
    { username: null
    , sshpubkey: null
    , shell: null
    , locked: false
    , groups: null
    // , attributes: null // Not for use at this time.
    , sudo: false
    , email: null
    , full_name: null
    , home: null
    , group: null
    , password: null
    , confirmPassword: null // Careful with this! Do not submit to middleware.
    , id: null
    , password_disabled: false
    }
  , nextUID: null
  , usersTasks: new Set()
  };

export default function users ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    // FORM
    case TYPES.UPDATE_USER_FORM:
      var userForm = Object.assign( {}, state.userForm );
      userForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, { userForm } );
    case TYPES.RESET_USER_FORM:
      return Object.assign( {}, state, { userForm: {} } );

    // QUERIES
    case TYPES.QUERY_USERS_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "queryUsersRequests" )
      );

    case TYPES.GET_NEXT_UID_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "getNextUIDRequests" )
      );

    // TODO: Handle these correctly
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:
      if ( state.queryUsersRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { users: payload.data }
          , resolveUUID( payload.UUID, state, "queryUsersRequests" )
        );
      } else if ( state.getNextUIDRequests.has( payload.UUID ) ) {
        return Object.assign( {}, state
          , { nextUID: payload.data }
          , resolveUUID( payload.UUID, state, "getNextUIDRequests" )
        );
      } else {
        return state;
      }

    // TASKS
    case TYPES.TASK_CREATED:
      if ( payload.data.name.startsWith( "user" ) ) {
        return Object.assign( {}, state
          , recordUUID( payload.data.id, state, "usersTasks" )
        );
      } else {
        return state;
      }
    case TYPES.TASK_UPDATED:
      if ( payload.data.name.startsWith( "user" ) ) {
        if ( payload.data.state === "FINISHED" ) {
          return Object.assign( {}, state
            , resolveUUID( payload.data.id, state, "usersTasks" )
          );
        } else {
          return Object.assign( {}, state
            , recordUUID( payload.data.id, state, "usersTasks" )
          );
        }
      } else {
        return state;
      }

    default:
      return state;
  }
};
