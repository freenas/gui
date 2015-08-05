// VDEV
// ====
// A simple wrapper component for representing a single VDEV.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import Disk from "../../../components/items/Disk";
import DragTarget from "../../../components/DragTarget";
import DropTarget from "../../../components/DropTarget";
import Icon from "../../../components/Icon";
import VDEVInfo from "./VDEV/VDEVInfo";

const VDEV = React.createClass(
  { propTypes:
    { handleDiskAdd    : React.PropTypes.func.isRequired
    , handleDiskRemove : React.PropTypes.func.isRequired
    , handleTypeChange : React.PropTypes.func.isRequired
    , availableDevices : React.PropTypes.array.isRequired
    , cols             : React.PropTypes.number
    , children         : React.PropTypes.array
    , path             : React.PropTypes.string
    , purpose: React.PropTypes.oneOf(
        [ "data"
        , "logs"
        , "cache"
        , "spares"
        ]
      ).isRequired
    , type: React.PropTypes.oneOf(
        // null is used for new vdevs. Such a vdev should have a falsy path, no
        // children, and a falsy existsOnServer.
        [ null
        , "disk"
        , "mirror"
        , "raidz1"
        , "raidz2"
        , "raidz3"
        ]
      )
    , allowedTypes: React.PropTypes.array.isRequired
    , existsOnServer: React.PropTypes.bool
    }

  , getDefaultProps () {
    return { purpose : "data"
           , cols    : 4
           };
  }

  // FIXME: This function is temporary, and should be removed
  , createNewDeviceOptions ( device, index ) {
    return (
      <option
        key   = { index }
        value = { device }
        label = { device } />
    );
  }

  , createDiskItem ( path, key ) {
      let deleteButton = null;

      if ( !this.props.existsOnServer ) {
        deleteButton = (
          <span
            className = "disk-remove"
            onClick = { this.props.handleDiskRemove.bind( null, path ) }
          >
            <Icon glyph="times" />
          </span>
        );
      }

      return (
        <div className="disk-wrapper">
          <DragTarget
            namespace = "disk"
            payload = { path }
            callback = { this.props.handleDiskRemove.bind( null, path ) }
          >
            { deleteButton }
            <Disk
              handleDiskRemove = { this.props.handleDiskRemove }
              existsOnServer = { this.props.existsOnServer }
              path = { path }
              key = { key }
            />
          </DragTarget>
        </div>
      );
    }

  , render () {
    let toolbar   = null;
    let vdevDisks = null;
    let addDisks  = null;
    let message   = null;

    if ( this.props.type === "disk" ) {
      // "Disk" is an unusual case in the sense that it will have no children
      // and "path" will be defined at the top level. Much of the complexity
      // in this component has to do with transitioning back and forth from
      // "disk" to other layouts.
      vdevDisks = this.createDiskItem( this.props.path, 0 );
    } else if ( this.props.type ) {
      vdevDisks = this.props.children.map( ( diskVdev, index ) => {
        return this.createDiskItem( diskVdev.path, index );
      });
    }

    // DISPLAY LOGIC
    // Rather than trying to split this up into a verbose logic tree, each
    // potential display component in VDEV has its own condition for display.

    // TOOLBAR
    // We want to see the toolbar anytime the VDEV is capable of displaying
    // disks. This means that we should see if when there are disks available or
    // disks have already been added (this.props.type will have a string value)
    if ( this.props.availableDevices.length || this.props.type ) {
      toolbar = (
        <VDEVInfo
          type             = { this.props.type }
          allowedTypes     = { this.props.allowedTypes }
          handleTypeChange = { this.props.handleTypeChange }
        />
      );
    }

    // ADD DISKS
    // FIXME: Right now, you can add disks if they're available.
    // TODO: Make this not a dropdown
    if ( this.props.availableDevices.length ) {
      addDisks = (
        <select
          // Reset the field to nothing selected every time so that it doesn't
          // move to a valid option and make it impossible to select that one
          // next.
          value = "-- SELECT --"
          onChange= { event => this.props.handleDiskAdd( event.target.value ) }
        >
          <option>{ "-- SELECT --" }</option>
          { this.props.availableDevices.map( this.createNewDeviceOptions ) }
        </select>
      );
    }

    // NO AVAILABLE DEVICES MESSAGE
    // There are no available devices, and nothing has been added to the VDEV
    // already - it's empty and nothing can be added.
    if ( !this.props.availableDevices.length && !vdevDisks ) {
      message = (
        <div className="text-center pool-vdev-message">
          { `No available ${ this.props.purpose } devices.` }
        </div>
      );
    }

    return (
      <TWBS.Col xs={ this.props.cols }>
        <DropTarget
          namespace = "disk"
          disabled = { Boolean( this.props.availableDevices.length ) }
          callback = { this.props.handleDiskAdd }
          activeDrop = "Drop disks here"
        >
          <TWBS.Well className="clearfix vdev-bucket">
            { toolbar }
            { vdevDisks }
            { addDisks }
            { message }
          </TWBS.Well>
        </DropTarget>
      </TWBS.Col>
    );
  }

  }
);

export default VDEV;
