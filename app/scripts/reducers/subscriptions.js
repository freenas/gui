// SUBSCRIPTIONS - REDUCER
// =======================

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { active: {}
  };


export default function subscriptions ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let active;

  switch ( type ) {
    case TYPES.SUBSCRIBE:
      active = Object.assign( {}, state.active );

      payload.masks.forEach( mask => {
        if ( active[ mask ] ) {
          if ( active[ mask ][ payload.componentID ] ) {
            active[ mask ][ payload.componentID ] ++;
          } else {
            active[ mask ][ payload.componentID ] = 1;
          }
        } else {
          active[ mask ] = { [ payload.componentID ]: 1 };
        }
      });

      return Object.assign( {}, state, { active } );


    case TYPES.UNSUBSCRIBE:
      active = Object.assign( {}, state.active );

      payload.masks.forEach( mask => {
        if ( active[ mask ] ) {
          if ( active[ mask ][ payload.componentID ] > 1 ) {
            active[ mask ][ payload.componentID ] --;
          } else {
            delete active[ mask ][ payload.componentID ];
          }

          if ( Object.keys( active[ mask ] ).length === 0 ) {
            delete active[ mask ];
          }
        }
      });

      return Object.assign( {}, state, { active } );

    default:
      return state;
  }
}
