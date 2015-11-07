// EVENTS - ACTION CREATORS
// ========================

"use strict";

import moment from "moment";

import * as TYPES from "./actionTypes";
import freeNASUtil from "../utility/freeNASUtil";

// An event will be considered "stale" after this much time has elapsed
const STALE_AFTER = 10000;
// This delay ensures that moving focus away from the notifications will not
// cause them to instantly disappear, and gives the user time to re-enter the
// element and re-freeze the events
const UNFREEZE_AFTER = 5000;

function staleEventAction ( eventID ) {
  return { type: TYPES.EVENT_IS_STALE, payload: { eventID } };
}

function enqueueStaleEventAction ( eventID ) {
  return { type: TYPES.ENQUEUE_STALE_EVENT, payload: { eventID } };
}

export function systemEvent ( eventData, timestamp ) {
  return ( dispatch, getState ) => {
    const state = getState();
    const eventID = freeNASUtil.generateUUID();
    const clientTimestamp = moment();
    const data = eventData.args.args;

    let type, text, icon, bsStyle;


    switch ( eventData.args.name ) {
      case "server.client_login":
        if ( data.username ) {
          icon = "icon-desktop";
          type = TYPES.EVENT_CLIENT_LOGIN;
          text = `${ data.username } logged in`;
        } else {
          console.warn( `Expected client_login to provide a username`, eventData );
        }
        break;

      case "server.client_logout":
        if ( data.username ) {
          icon = "icon-desktop";
          type = TYPES.EVENT_CLIENT_LOGIN;
          text = `${ data.username } logged out`;
        } else {
          console.warn( `Expected client_login to provide a username`, eventData );
        }
        break;

      // TODO: Re-enable these when we have a better plan (too much noise)
      // case "system.device.changed":
      //   type = TYPES.EVENT_DEVICE_CHANGED;
      //   text = "Device status changed";
      //   break;

      // case "system.device.detached":
      //   type = TYPES.EVENT_DEVICE_DETACHED;
      //   text = "Device status detached";
      //   break;

      case "system.network.interface.attached":
        icon = "icon-flowchart";
        bsStyle = "success";
        type = TYPES.EVENT_INTERFACE_ATTACHED;
        text = "Network interface attached";
        break;

      case "system.network.interface.detached":
        icon = "icon-flowchart";
        bsStyle = "warn";
        type = TYPES.EVENT_INTERFACE_DETACHED;
        text = "Network interface detached";
        break;

      case "system.network.interface.link_down":
        icon = "icon-flowchart";
        bsStyle = "default";
        type = TYPES.EVENT_INTERFACE_LINK_UP;
        text = "Network Interface changed to UP";
        break;

      case "system.network.interface.link_up":
        icon = "icon-flowchart";
        bsStyle = "primary";
        type = TYPES.EVENT_INTERFACE_LINK_DOWN;
        text = "Network Interface changed to DOWN";
        break;

      case "users.changed":
        icon = "icon-profile";
        type = TYPES.EVENT_USERS_CHANGED;
        text = "User updated";
        break;

      case "groups.changed":
        icon = "icon-group";
        type = TYPES.EVENT_GROUPS_CHANGED;
        text = "Group updated";
        break;

      case "entity-subscriber.shares.changed":
        var shareName = null;

        if ( data.entities && data.entities[0] ) {
          shareName = data.entities[0].name || shareName;
        } else if ( data.ids && data.ids[0] && state.shares.serverShares[ data.ids[0] ] ) {
          shareName = state.shares.serverShares[ data.ids[0] ].name || shareName;
        }

        if ( shareName ) {
          shareName = ` "${ shareName }" `;
        } else {
          shareName = " ";
        }

        if ( data.operation ) {
          icon = "icon-folder-alt";
          type = TYPES.EVENT_SHARES_CHANGED;

          switch ( data.operation ) {
            case "create":
              bsStyle = "success";
              text = `Share${ shareName }was created`;
              break;

            case "update":
              bsStyle = "primary";
              text = `Share${ shareName }was updated`;
              break;

            case "delete":
              bsStyle = "danger";
              text = `Share${ shareName }was deleted`;
              break;
          }
        } else {
          console.warn( `Expected shares.changed to provide an operation and some ids`, eventData );
        }
        break;

      case "update.changed":
        icon = "icon-download";
        type = TYPES.EVENT_UPDATE_CHANGED;
        text = "Update changed";
        break;

      case "entity-subscriber.volumes.changed":
        var volumeName = null;

        if ( data.entities && data.entities[0] ) {
          volumeName = data.entities[0].name || volumeName;
        } else if ( data.ids && data.ids[0] && state.volumes.serverVolumes[ data.ids[0] ] ) {
          volumeName = state.volumes.serverVolumes[ data.ids[0] ].name || volumeName;
        }

        if ( volumeName ) {
          volumeName = ` "${ volumeName }" `;
        } else {
          volumeName = " ";
        }

        if ( data.operation ) {
          icon = "icon-drive";
          type = TYPES.EVENT_VOLUMES_CHANGED;

          switch ( data.operation ) {
            case "create":
              bsStyle = "success";
              text = `Volume${ volumeName }was created`;
              break;

            case "update":
              bsStyle = "primary";
              text = `Volume${ volumeName }was updated`;
              break;

            case "delete":
              bsStyle = "danger";
              text = `Volume${ volumeName }was deleted`;
              break;
          }
        } else {
          console.warn( `Expected volumes.changed to provide an operation and some ids`, eventData );
        }
        break;
    }

    if ( type ) {
      const action =
        { type
        , payload:
          { eventID
          , clientTimestamp
          , text
          , timestamp
          , type
          , icon
          , bsStyle
          }
        };

      setTimeout( () => {
        const after = getState();

        if ( after.events.freezeNotifications ) {
          dispatch( enqueueStaleEventAction( eventID ) );
        } else {
          dispatch( staleEventAction( eventID ) );
        }
      }, STALE_AFTER );

      dispatch( action );
    }
  }
}


export function freezeNotifications () {
  return { type: TYPES.FREEZE_NOTIFICATIONS }
}

export function unfreezeNotifications () {
  return ( dispatch, getState ) => {
    const before = getState();

    setTimeout( () => {
      const after = getState();

      if ( before.events.frozenAt
        && before.events.frozenAt.isSame( after.events.frozenAt ) ) {
        dispatch( { type: TYPES.UNFREEZE_NOTIFICATIONS });
        dispatch( { type: TYPES.DEQUEUE_STALE_EVENTS });
      }
    }, UNFREEZE_AFTER );
  }
}