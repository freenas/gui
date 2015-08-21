// VDEV
// ====
// A simple wrapper component for representing a single VDEV.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import ZM from "../../../../flux/middleware/ZfsMiddleware";
import VS from "../../../../flux/stores/VolumeStore";
import DS from "../../../../flux/stores/DisksStore";

import ZfsUtil from "../utility/ZfsUtil";

import Disk from "../../../components/items/Disk";
import DragTarget from "../../../components/DragTarget";
import DropTarget from "../../../components/DropTarget";

import VDEVInfo from "./VDEV/VDEVInfo";
import BreakdownChart from "./BreakdownChart";

const VDEV = React.createClass(
  { displayName: "VDEV"

  , propTypes:
    { handleDiskAdd: React.PropTypes.func.isRequired
    , handleDiskRemove: React.PropTypes.func.isRequired
    , handleVdevNuke: React.PropTypes.func.isRequired
    , handleTypeChange: React.PropTypes.func.isRequired
    , cols: React.PropTypes.number.isRequired
    , children: React.PropTypes.array
    , path: React.PropTypes.string
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
        , "stripe"
        , "mirror"
        , "raidz1"
        , "raidz2"
        , "raidz3"
        ]
      )
    }

  , getInitialState () {
      return { devicesAreAvailable: this.queryDeviceAvailability()
             };
    }

  , componentDidMount () {
      VS.addChangeListener( this.handleUpdatedVS );
      ZM.subscribe( this.constructor.displayName );
    }

  , componentWillUnmount () {
      VS.removeChangeListener( this.handleUpdatedVS );
      ZM.unsubscribe( this.constructor.displayName );
    }

  , requiresSSDs () {
      return this.props.purpose === "cache" || this.props.purpose === "logs";
    }

  , queryDeviceAvailability () {
      if ( this.requiresSSDs() ) {
        return VS.SSDsAreAvailable;
      } else {
        return VS.HDDsAreAvailable;
      }
    }

  , handleUpdatedVS ( eventMask ) {
      let newState = {};

      switch ( eventMask ) {
        case "availableDisks":
          newState.devicesAreAvailable = this.queryDeviceAvailability();
          break;
      }

      this.setState( newState );
    }

  , preventHDDInSSDZone ( payload ) {
      if ( this.requiresSSDs() ) {
        return DS.isHDD( payload );
      }
      return false;
    }

  , createDiskItem ( path, key ) {
      let content;
      let mutable = VS.isDeviceAvailable( path );

      let disk = (
        <Disk
          handleDiskRemove = { this.props.handleDiskRemove }
          existsOnServer = { mutable }
          path = { path }
        />
      );

      if ( mutable ) {
        content = (
          <DragTarget
            namespace = "disk"
            payload = { path }
            callback = { this.props.handleDiskRemove.bind( null, path ) }
          >
            { disk }
            <span
              className = "disk-remove"
              onClick = { this.props.handleDiskRemove.bind( null, path ) }
              onMouseDown = { event => event.stopPropagation() }
            />
          </DragTarget>
        );
      } else {
        content = disk;
      }

      return (
        <div
          className="disk-wrapper"
          key = { key }
        >
          { content }
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
    // "Spares" should not show the bar, as it will always be a collection of
    // "disk" VDEVs
    if ( this.props.purpose !== "spares"
       && ( this.state.devicesAreAvailable || this.props.type )
       ) {
      let breakdown;
      let chart = null;

      if ( this.props.purpose === "data"
        && ( this.props.path || this.props.children )
        ) {
        breakdown = ZfsUtil.calculateBreakdown( [ this.props ] );
        chart = (
          <BreakdownChart
            total  = { breakdown.avail + breakdown.parity }
            parity = { breakdown.parity }
            used   = { 0 }
            free   = { breakdown.avail }
          />
        );
      }

      toolbar = (
        <VDEVInfo
          type = { this.props.type }
          allowedTypes = { this.props.allowedTypes }
          handleTypeChange = { this.props.handleTypeChange }
          handleVdevNuke = { this.props.handleVdevNuke }
        >
          { chart }
        </VDEVInfo>
      );
    }

    // ADD DISKS
    // FIXME: Right now, you can add disks if they're available.
    // TODO: Make this not a dropdown
    if ( this.state.devicesAreAvailable && !vdevDisks ) {
      addDisks = (
        <h5 className="text-center text-muted">
          { `Drag and drop ${ this.requiresSSDs() ? "SSDs" : "disks" } to add `
          + `${ this.props.purpose }`
          }
        </h5>
      );
    }

    // NO AVAILABLE DEVICES MESSAGE
    // There are no available devices, and nothing has been added to the VDEV
    // already - it's empty and nothing can be added.
    if ( !this.state.devicesAreAvailable && !vdevDisks ) {
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
          disabled = { this.state.devicesAreAvailable }
          preventDrop = { this.preventHDDInSSDZone }
          callback = { this.props.handleDiskAdd }
          activeDrop
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
