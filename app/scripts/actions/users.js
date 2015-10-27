// USERS - ACTIONS
// ===============

"use strict";

import _ from "lodash";

import { UPDATE_USER_FORM
       , RESET_USER_FORM
       , QUERY_USERS_REQUEST
       , GET_NEXT_UID_REQUEST
       , USER_CREATE_TASK
       , USER_UPDATE_TASK
       }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateUserForm ( field, value ) {
  return ( { type: UPDATE_USER_FORM
           , payload: { field: field
                      , value: value
                      }
           }
         );
};

export function resetUserForm () {
  return ( { type: RESET_USER_FORM } );
};

// QUERIES
export function requestUsers () {
  return ( dispatch ) => {
    MC.request( "users.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, QUERY_USERS_REQUEST ) )
              );
  }
};

export function requestNextUID () {
  return ( dispatch ) => {
    MC.request( "users.next_uid"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, GET_NEXT_UID_REQUEST ) )
              );
  }
};

// TASKS
export function createUser () {
  return ( dispatch, getState ) => {
    const state = getState();
    var newUserProps = Object.assign( {}, state.users.userForm );

    _.forOwn( newUserProps
            , function processProperties ( property, key, newUserProps ) {
              if ( property === null ) {
                delete newUserProps[ key ];
              }
              if ( key === "confirmPassword" ) {
                delete newUserProps[ key ];
              }
              if ( key === "group" ) {
                newUserProps[ key ] = Number.parseInt( property );
              }
            }
            );

    if ( _.find( state.users.users
               , { userName: newUserProps.userName }
               )
       ) {
      throw new Error( "Attempted to create a user with an existing username." );
    }

    if ( _.find( state.users.users
               , { id: newUserProps.id }
               )
       ) {
      throw new Error( "Attempted to create a user with an existing user id." );
    }

    if ( !newUserProps.passwordDisabled
      && ( typeof newUserProps.password !== "string"
        || newUserProps.password === ""
         )
       ) {
      throw new Error( "Attempted to create a user with a missing or invalid"
                     + " password."
                     );
    }

    MC.request( "task.submit"
              , [ "users.create", [ newUserProps ] ]
              , UUID => dispatch( watchRequest( UUID, USER_CREATE_TASK ) )
              );
  }
};

export function updateUser ( userName ) {
  return ( dispatch, getState ) => {
    const state = getState();
    var updatedUserProps = Object.assign( {}, state.users.userForm );

    _.forOwn( updatedUserProps
            , function processProperties ( property, key, updatedUserProps ) {
              if ( property === null ) {
                delete updatedUserProps[ key ];
              }
              if ( key === "confirmPassword" ) {
                delete updatedUserProps[ key ];
              }
              if ( key === "group"
                && property !== undefined
                && property !== null
                 ) {
                updatedUserProps[ key ] = Number.parseInt( property );
              }
            }
            );

    if ( typeof updatedUserProps.name === "string"
      && _.find( state.users.users
               , { userName: updatedUserProps.userName }
               )
       ) {
      throw new Error( "Attempted to change a username to one which is already"
                     + "in use."
                     );
    }

    MC.request( "task.submit"
              , [ "users.update", [ userName, updatedUserProps ] ]
              , UUID => dispatch( watchRequest( UUID, USER_UPDATE_TASK ) )
              );
  }
};
