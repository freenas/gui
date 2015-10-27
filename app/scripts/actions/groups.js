// GROUPS - ACTIONS
// ================

"use strict";

import { UPDATE_GROUP_FORM
       , RESET_GROUP_FORM
       , QUERY_GROUPS_REQUEST
       , GET_NEXT_GID_REQUEST
       , GROUP_CREATE_TASK
       , GROUP_DELETE_TASK
       }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateGroupForm ( field, value ) {
  return ( { type: UPDATE_GROUP_FORM
           , payload: { field: field
                      , value: value
                      }
           }
         );
};

export function resetGroupForm () {
  return ( { type: RESET_GROUP_FORM } );
};

// QUERIES
export function requestGroups () {
  return ( dispatch ) => {
    MC.request( "groups.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, QUERY_GROUPS_REQUEST ) )
              );
  }
};

export function requestNextGID () {
  return ( dispatch ) => {
    MC.request( "groups.next_gid"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, GET_NEXT_GID_REQUEST ) )
              );
  }
};

// TASKS
export function createGroup () {
  return ( dispatch, getState ) => {
    const state = getState();
    var newGroupProps = Object.assign( {}, state.groups.groupForm );

    _.forOwn( newGroupProps
            , function processProperties ( property, key, newGroupProps ) {
              if ( property === null ) {
                delete newGroupProps[ key ];
              }
            }
            );

    if ( _.find( state.groups.groups
               , { name: newGroupProps.name }
               )
       ) {
      throw new Error( "Attempted to create a group with an existing name." );
    }

    if ( _.find( state.groups.groups
               , { id: newGroupProps.id }
               )
       ) {
      throw new Error( "Attempted to create a group with an existing group id." );
    }
    MC.request( "task.submit"
              , [ "groups.create", [ newGroupProps ] ]
              , UUID => dispatch( watchRequest( UUID, GROUP_CREATE_TASK ) )
              );
  }
};

export function deleteGroup ( groupName ) {
  return ( dispatch ) => {
    MC.request( "task.submit"
              , [ "groups.delete", [ groupName ] ]
              , UUID => dispatch( watchRequest( UUID, GROUP_DELETE_TASK ) )
              );
  }
};
