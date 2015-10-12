// Groups Flux Store
// -----------------

"use strict";

import _ from "lodash";
import { EventEmitter } from "events";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

import GM from "../middleware/GroupsMiddleware";

var CHANGE_EVENT = "change";
var UPDATE_MASK  = "groups.changed";
var PRIMARY_KEY  = "id";

var _localUpdatePending = {};
var _updatedOnServer    = [];
var _groups = {};
var _nextGID = null;

const GROUP_SCHEMA =
  { type: "object"
  , properties:
    { name: { type: "string" }
    , id: { type: "number" }
    , builtin: { type: [ "boolean", "null" ] }
    , sudo: { type: "boolean" }
    }
  };

const GROUP_LABELS =
  { name: "Group Name"
  , id: "Group ID"
  , builtin: "Built-in System Group"
  , sudo: "sudo access"
  };

class GroupsStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );

    this.KEY_UNIQUE = "name";
    this.ITEM_SCHEMA = GROUP_SCHEMA;
    this.ITEM_LABELS = GROUP_LABELS;
  }

  get updateMask () {
    return UPDATE_MASK;
  }

  get pendingUpdateIDs () {
    return _updatedOnServer;
  }

  get groups () {
    return _.values( _groups );
  }

  get nextGID () {
    return _nextGID;
  }

  getGroup ( groupID ) {
    return _groups[ groupID ];
  }

  isLocalTaskPending ( groupID ) {
    return _.values( _localUpdatePending ).indexOf( groupID ) > -1;
  }
  isGroupUpdatePending ( groupID ) {
    return _updatedOnServer.indexOf( groupID ) > -1;
  }

  findGroupByKeyValue ( key, value ) {
    return _.find( _groups
                 , function ( group ) {
                   return group[ key ] === value;
                 }
                 );
  }

}

function handlePayload ( payload ) {
  const ACTION = payload.action;
  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_GROUPS_LIST:

      ACTION.groupsList.forEach(
        function convertGroups ( group ) {
          _groups[ group.id ] = group;
        }
        , this
      );

      this.emitChange( "groupsList" );
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      let args = ACTION.eventData.args;
      let updateData = args.args;

      if ( args.name === "entity-subscriber.groups.changed" ) {
        if ( updateData.operation === "delete" ) {
          _groups = _.omit( _groups, updateData.ids );
          this.emitChange( "groupsDeleted" );
        } else if ( updateData.operation === "update" ) {
          updateData.entities.forEach( function addNewGroup ( group ) {
                                         _groups[ group.id ] = group;
                                       }
                                     );
          this.emitChange( "groupUpdated" );
        } else if ( updateData.operation === "create" ) {
          updateData.entities.forEach( function updateGroup ( group ) {
                                         _groups[ group.id ] = group;
                                       }
                                     );
          this.emitChange( "groupCreated" );
        }

      } else if ( args.name === "task.progress"
                && updateData.state === "FINISHED" ) {
        delete _localUpdatePending[ updateData.id ];
      }
      break;

    case ActionTypes.RECEIVE_NEXT_GID:
      _nextGID = action.nextGID;
      this.emitChange( "nextGID" );
      break;

    case ActionTypes.RECEIVE_GROUP_UPDATE_TASK:
      _localUpdatePending[ ACTION.taskID ] = ACTION.groupID;
      this.emitChange();
      break;

    default:
    // Do Nothing
  }
};

export default new GroupsStore ();
