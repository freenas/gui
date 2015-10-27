// GROUPS - ACTIONS
// ================

"use strict";

import { UPDATE_GROUP_FORM
       , RESET_GROUP_FORM
       , QUERY_GROUPS_REQUEST
       , GET_NEXT_GID_REQUEST
       , GROUP_CREATE_TASK
       , GROUP_UPDATE_TASK
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
              if ( key === "id" ) {
                let newID;
                // The expected case. Parse a string into an integer, use that.
                if ( typeof property === "string" ) {
                  // First check if the field is empty. If so, use the fallback,
                  // which is the nextGID.
                  if ( property === "" ) {
                    newID = state.groups.nextGID;
                  } else {
                    // Now we parse the string into an integer
                    newID = Number.parseInt( property, 10 );
                    // If the string was anything but an integer, throw.
                    if ( Number.isNaN( newID ) ) {
                      throw new Error( "Attempted to create a group with a non-"
                                     + "integer id."
                                     );
                    }
                  }
                  // If the field was a number (a possible choice), check that
                  // it's an integer and use it if so
                } else if ( typeof property === "number"
                         && Number.isInteger( property )
                          ) {
                  newID = property;
                  // In the standard fallback case where the field was never
                  // edited, use the nextGID.
                } else if ( property === null
                         || typeof property === "undefined"
                          ) {
                  newID = state.groups.nextGID;
                } else {
                  // If all of the above fail, mistakes were made, throw.
                  throw new Error( "Attempted to create a group with a non-"
                                 + "integer id."
                                 );
                }
                newGroupProps.id = newID;
              } else if ( property === null ) {
                // Honestly this is just for sudo, to avoid middleware complaint
                // if the value we submit is bad.
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

    // One more id failure case: the form was legit, but the id is in use.
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

export function updateGroup ( groupID ) {
  return ( dispatch, getState ) => {
    const state = getState();
    var newGroupProps = Object.assign( {}, state.groups.groupForm );

    _.forOwn( newGroupProps
            , function processProperties ( property, key, newGroupProps ) {
              if ( property === null ) {
                delete newGroupProps[ key ];
              }
              if ( key === "id" ) {
                if ( property !== null && typeof property !== "undefined" ) {
                  throw new Error( "Attempted to edit a group id." );
                }
              }
            }
            );

    if ( newGroupProps.name && _.find( state.groups.groups
                                     , { name: newGroupProps.name }
                                     )
       ) {
      throw new Error( "Attempted to rename a group with a group name that is already in use." );
    }

    MC.request( "task.submit"
              , [ "groups.update", [ groupID, newGroupProps ] ]
              , UUID => dispatch( watchRequest( UUID, GROUP_UPDATE_TASK ) )
              );
  }
};

export function deleteGroup ( groupID ) {
  return ( dispatch ) => {
    MC.request( "task.submit"
              , [ "groups.delete", [ groupID ] ]
              , UUID => dispatch( watchRequest( UUID, GROUP_DELETE_TASK ) )
              );
  }
};
