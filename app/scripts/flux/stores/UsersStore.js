// Users Flux Store
// ----------------

"use strict";

import _ from "lodash";
import { EventEmitter } from "events";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

import UsersMiddleware from "../middleware/UsersMiddleware";

var CHANGE_EVENT = "change";
var UPDATE_MASK  = "users.changed";
var PRIMARY_KEY  = "id";

var _updatedOnServer    = [];
var _localUpdatePending = {};
var _users              = {};
var _nextUID = null;

const USER_SCHEMA =
  { type: "object"
  , properties:
    { username:          { type: "string" }
    , sshpubkey:         { type: [ "string", "null" ] }
    , shell:             { type: "string" }
    , locked:            { type: "boolean" }
    , full_name:         { type: [ "string", "null" ] }
    , home:              { type: "string" }
    , group:             { type: "integer" }
    , id:                { type: "number" }
    , password_disabled: { type: "boolean" }
    , unixhash:          { type: [ "string", "null" ] }
    , sudo:              { type: "boolean" }
    , smbhash:           { type: [ "string", "null" ] }
    , email:             { type: [ "string", "null" ] }
    , groups:
      { items: { type: "integer" }
      , type: "array"
      }
    , sessions:
      { readOnly: true
      , type: "array"
      }
    , builtin:
      { readOnly: true
      , type: "boolean"
      }
    , loggedin:
      { readOnly: true
      , type: "boolean"
      }
  }
};


class UsersStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );

    this.ITEM_SCHEMA = USER_SCHEMA;
  }

  get updateMask () {
    return UPDATE_MASK;
  }

  get pendingUpdateIDs () {
    return _updatedOnServer;
  }

  get users () {
    return _.values( _users );
  }

  get nextUID () {
    return _nextUID ;
  }

  findUserByKeyValue ( key, value ) {
    var predicate = {};
    predicate[ key ] = value;

    return _.find( _users, predicate );
  }

  isLocalTaskPending ( id ) {
    return _.values( _localUpdatePending ).indexOf( id ) > -1;
  }

  isUserUpdatePending ( id ) {
    return _updatedOnServer.indexOf( id ) > -1;
  }

  findUserByKeyValue ( key, value ) {
    var predicate = {};
    predicate[ key ] = value;

    return _.find( _users, predicate );
  }

  getUser ( id ) {
    return _users[ id ];
  }

  // Returns an array of the complete objects for each user in
  // the requested group.
  getUsersByGroup ( groupID ) {
    var groupUsers = _.filter( _users, function ( currentUser ) {
      if ( _.includes( currentUser.groups, groupID )
                    || currentUser.group === groupID ) {
        return true;
      } else {
        return false;
      }
    });
    return groupUsers;
  }
}

function handlePayload ( payload ) {
  const action = payload.action;

  switch ( action.type ) {

    case ActionTypes.RECEIVE_RAW_USERS:

      let updatedUserIDs = _.pluck( action.rawUsers, PRIMARY_KEY );

      // When receiving new data, we can comfortably resolve anything that may
      // have had an outstanding update indicated by the Middleware.
      if ( _updatedOnServer.length > 0 ) {
        _updatedOnServer = _.difference( _updatedOnServer, updatedUserIDs );
      }

      action.rawUsers.map( function ( user ) {
        _users[ user [ PRIMARY_KEY ] ] = user;
      });

      this.emitChange( "usersList" );
      break;

    case ActionTypes.RECEIVE_NEXT_UID:
      _nextUID = action.nextUID;
      this.emitChange( "nextUID" );
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      let args = action.eventData.args;
      let updateData = args.args;

      if ( args.name === "entity-subscriber.users.changed" ) {
        if ( updateData.operation === "delete" ) {
          _users = _.omit( _users, updateData.ids );
          this.emitChange( "userDeleted" );
        } else if ( updateData.operation === "update" ) {
          updateData.entities.forEach( function addNewUsers ( user ) {
                                         _users[ user.id ] = user;
                                       }
                                     );
          this.emitChange( "userCreated" );
        } else if ( updateData.operation === "create" ) {
          updateData.entities.forEach( function updateUser ( user ) {
                                         _users[ user.id ] = user;
                                       }
                                     );
          this.emitChange( "userUpdated" );
        }

      // TODO: Make this more generic,
      // triage it earlier, create ActionTypes for it
      } else if (
        args.name === "task.progress"
        && args.args.state === "FINISHED"
      ) {
        delete _localUpdatePending[ args.args.id ];
      }

      break;

    case ActionTypes.RECEIVE_USER_UPDATE_TASK:
      _localUpdatePending[ action.taskID ] = action.userID;
      this.emitChange();
      break;

    default:
    // No action
  }
};

export default new UsersStore();
