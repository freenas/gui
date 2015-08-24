// Interfaces Flux Store
// =====================

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

const CHANGE_EVENT = "change";
const UPDATE_MASK  = "network.interface.changed";

var _updatedOnServer    = [];
var _localUpdatePending = {};
var _interfaces         = {};

const INTERFACE_SCHEMA =
  { type: "object"
  , properties:
    { status:
        { type: "object"
        , properties:
          { "link-state"    : { type: "string" }
          , "link-address"  : { type: "string" }
          , flags:
            { enum:
              [ "DRV_RUNNING"
              , "UP"
              , "BROADCAST"
              , "SIMPLEX"
              , "MULTICAST"
              ]
            , type: "string"
            }
          , name            : { type: "string" }
          , aliases:
            { items : { $ref: "network-interface-alias" }
            , type  : "array"
            }
          }
        }
    , name    : { type: "string" }
    , dhcp    : { type: "boolean" }
    , enabled : { type: "boolean" }
    , aliases:
      { items : { $ref: "network-interface-alias" }
      , type  : "array"
      }
    , type    : { type: "string" }
    , id      : { type: "string" }
    , mtu     : { type: [ "integer", "null" ] }
    }
  };

const INTERFACE_LABELS =
    { status              : "Status"
    , "link-state"        : "Link State"
    , "link-address"      : "Link Address"
    , flags               : "Flags"
    , name                : "Interface Name"
    , aliases             : "Aliases"
    , dhcp                : "DHCP"
    , enabled             : "Enabled"
    , type                : "Type"
    , id                  : "Interface ID"
    , mtu                 : "MTU"
  };

class InterfacesStore extends FluxBase {

  constructor () {
    super()

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );

    this.KEY_UNIQUE = "name";
    this.ITEM_SCHEMA = INTERFACE_SCHEMA;
    this.ITEM_LABELS = INTERFACE_LABELS;
  }

  get updateMask () {
    return UPDATE_MASK;
  }

  get pendingUpdateNames () {
    return _updatedOnServer;
  }

  /**
   * Check if the selected interface is
   * in the list of interfaces with pending updates.
   * @param  {String} name The interface name.
   * @return {Boolean}
   */
  isLocalTaskPending ( name ) {
    return _.values( _localUpdatePending ).indexof( name ) > -1;
  }

  /**
   * Check if the selected interface is in the list of updated interfaces.
   * @param  {String} name The interface name.
   * @return {Boolean}
   */
  isInterfaceUpdatePending ( name ) {
      return _updatedOnServer.indexof( name ) > -1;
  }

  findInterfaceByKeyValue ( key, value ) {
    var predicate = {};
    predicate[ key ] = value;
    return _.find( _interfaces, predicate );
  }

  get interfaces () {
    return _.values( _interfaces );
  }

}

function handlePayload ( payload ) {
  var action = payload.action;
  var eventData = action.eventData;

  switch ( action.type ) {

    case ActionTypes.RECEIVE_INTERFACES_LIST:
      var updatedInterfaceNames = _.pluck( action.rawInterfacesList, "name" );

      if ( _updatedOnServer.length ) {
        _updatedOnServer = _.difference(
          _updatedOnServer
          , updatedInterfaceNames
        );
      }

      action.rawInterfacesList.map( function ( _interface ) {
        _interfaces[ _interface.name ] = _interface;
      });
      this.emitChange();
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
    let args = eventData.args;
      if ( args.name === "entity-subscriber.network.interfaces.changed" ) {
        _interfaces[ args.args.entities[0].name ] =
          _.cloneDeep( args.args.entities[0] );
        this.emitChange();
      }

    case ActionTypes.RECEIVE_UP_INTERFACE_TASK:
    case ActionTypes.RECEIVE_DOWN_INTERFACE_TASK:
    case ActionTypes.RECEIVE_INTERFACE_CONFIGURE_TASK:
      _localUpdatePending[ action.taskID ] = action.interfaceName;
      this.emitChange();
      break;

    default:
    // Do nothing
  }
}

export default new InterfacesStore();
