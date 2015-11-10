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
       , USER_DELETE_TASK
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
    var uid = newUserProps.id;

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
               , { id: uid }
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

    if ( typeof uid === "string" ) {
      if ( uid === "" ) {
        newUserProps.id = null;
      } else {
        uid = Number.parseInt( uid );
        if ( !Number.isInteger( uid ) ) {
          throw new Error( "Attempted to submit an invalid user id." );
        } else {
          newUserProps.id = uid;
        }
      }
    }

    MC.request( "task.submit"
              , [ "users.create", [ newUserProps ] ]
              , UUID => dispatch( watchRequest( UUID, USER_CREATE_TASK ) )
              );
  }
};

export function updateUser ( userID ) {
  return ( dispatch, getState ) => {
    const state = getState();
    const userToUpdate = _.find( state.users.users, { id: userID } );
    if ( userToUpdate === undefined ) {
      throw new Error( "Attempted to update a nonexistant user." );
    }
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

    // Check for restrictions on root and other system users
    if ( userToUpdate.id === 0 || userToUpdate.id === "0" ) {
      if ( updatedUserProps.id !== "undefined" ) {
        throw new Error( "Attempted to change root's user id." );
      }
      if ( updatedUserProps.builtin !== "undefined" ) {
        throw new Error( "Attempted to update a built-in system user." );
      }
      if ( updatedUserProps.home !== "undefined" ) {
        throw new Error( "Attempted to change root's home directory." );
      }
      if ( typeof updatedUserProps.locked !== "undefined"
        || typeof updatedUserProps.password_disabled !== "undefined" ) {
        throw new Error( "Attempted to change root's login capabilities." );
      }
      if ( typeof updatedUserProps.sudo !== "undefined" ) {
        throw new Error( "Attempted to change root's sudoer status. (Why?)" );
      }
      if ( typeof updatedUserProps.userName !== "undefined" ) {
        throw new Error( "Attempted to change root's username." );
      }
      if ( typeof updatedUserProps.group !== "undefined"
        || typeof updatedUserProps.groups !== "undefined" ) {
        throw new Error( "Attempted to change root's group membership." );
      }
    } else if ( userToUpdate.builtin ) {
      throw new Error( "Attempted to update a built-in system user." );
    }

    if ( typeof updatedUserProps.name === "string"
      && _.find( state.users.users
               , { userName: updatedUserProps.userName }
               )
       ) {
      throw new Error( "Attempted to change a username to one which is already"
                     + "in use."
                     );
    }

    var uid = updatedUserProps.id;
    if ( typeof uid === "string" ) {
      if ( uid === "" ) {
        updatedUserProps.id = null;
      } else {
        uid = Number.parseInt( uid );
        if ( !Number.isInteger( uid ) ) {
          throw new Error( "Attempted to submit an invalid user id." );
        } else {
          updatedUserProps.id = uid;
        }
      }
    }

    MC.request( "task.submit"
              , [ "users.update", [ userID, updatedUserProps ] ]
              , UUID => dispatch( watchRequest( UUID, USER_UPDATE_TASK ) )
              );
  }
};

export function deleteUser ( userID ) {
  return ( dispatch, getState ) => {
    const state = getState();
    const userToDelete = _.find( state.users.users, { id: userID } );
    if ( userToDelete === "undefined" ) {
      throw new Error( "Attempted to delete a nonexistant user." );
    }
    if ( userToDelete.builtin ) {
      throw new Error( "Attempted to delete a built-in system user." );
    }
    MC.request( "task.submit"
              , [ "users.delete", [ userID ] ]
              , UUID => dispatch( watchRequest( UUID, USER_DELETE_TASK ) )
              );
  }
};
