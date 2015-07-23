// TOPOLOGY DRAWER
// ==============
// A section of the Pool/Volume UI that shows the constituent VDEVs which are
// being used for logs, cache, data, and spares.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import Icon from "../../../components/Icon";

import VDEV from "./VDEV";

var TopologyDrawer = React.createClass(

  { propTypes:
    { handleDiskAdd        : React.PropTypes.func.isRequired
    , handleDiskRemove     : React.PropTypes.func.isRequired
    , handleVdevAdd        : React.PropTypes.func.isRequired
    , handleVdevRemove     : React.PropTypes.func.isRequired
    , handleVdevTypeChange : React.PropTypes.func.isRequired
    , availableDisks       : React.PropTypes.array.isRequired
    , availableSSDs        : React.PropTypes.array.isRequired
    , data                 : React.PropTypes.array.isRequired
    , logs                 : React.PropTypes.array.isRequired
    , cache                : React.PropTypes.array.isRequired
    , spares               : React.PropTypes.array.isRequired
    }

  , createVdevs: function ( purpose ) {
    const commonProps =
      { handleDiskAdd        : this.props.handleDiskAdd
      , handleDiskRemove     : this.props.handleDiskRemove
      , handleVdevRemove     : this.props.handleVdevRemove
      , handleVdevTypeChange : this.props.handleVdevTypeChange
      };
    let availableDevices;
    let cols;
    let newVdevAllowed = false;
    let vdevs = [];

    switch ( purpose ) {
      case "logs":
      case "cache":
        availableDevices = this.props.availableSSDs;
        cols           = 12;
        // Log and Cache currently only allow a single VDEV.
        if ( this.props[ purpose ].length < 1 ) {
          newVdevAllowed = true;
        }
        break;

      case "spares":
        availableDevices = this.props.availableDisks;
        cols             = 12;
        if ( this.props[ purpose ].length < 1 ) {
          newVdevAllowed = true;
        }
        break;
      case "data":
      default:
        availableDevices = this.props.availableDisks;
        cols           = 4;    // TODO: More intricate logic for this
        newVdevAllowed = true; // TODO: There should be cases where we don't
        break;
    }

    vdevs = this.props[ purpose ].map(
      function ( vdev, index ) {
        // Destructure vdev to avoid passing in props which will not be used.
        let { children, status, type, path } = vdev;

        // A vdev exists on the server if the volume it's in does and the
        // volume has a vdev of that purpose and index. This only applies to
        // "data" vdevs.
        let existsOnServer = false;

        return (
          <VDEV { ...commonProps }
            children          = { children }
            status            = { status }
            type              = { type }
            path              = { path }
            purpose           = { purpose }
            cols              = { cols }
            availableDevices  = { availableDevices }
            vdevKey           = { index }
            key               = { index }
            existsOnServer    = { existsOnServer }
          />
        );
      }.bind( this )
    );

    if ( newVdevAllowed ) {
      if ( availableDevices.length ) {
        vdevs.push(
          <TWBS.Col xs = { cols } >
            <span
              className = "text-center"
              onClick   = { this.props.handleVdevAdd.bind( null, purpose ) }
            >
              <h3><Icon glyph = "plus" /></h3>
              <h3>{ `Add ${ purpose } VDEV` }</h3>
            </span>
          </TWBS.Col>
        );
      } else {
        vdevs.push(
          <TWBS.Col
            xs        = { cols }
            className = "text-center"
          >
            <TWBS.Well className="pool-vdev-message">
              { `No available ${ purpose } devices.` }
            </TWBS.Well>
          </TWBS.Col>
        );
      }
    }

    return vdevs;
  }

  , render: function () {

    return (
      <div
        style     = { this.props.style }
        className = "pool-topology"
      >

        <TWBS.Row>
          {/* LOG AND CACHE DEVICES */}
          <TWBS.Col
            xs={ 6 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Cache</h4>
            { this.createVdevs( "cache" ) }
          </TWBS.Col>
          <TWBS.Col
            xs={ 6 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Log</h4>
            { this.createVdevs( "logs" ) }
          </TWBS.Col>

          {/* STORAGE VDEVS */}
          <TWBS.Col
            xs={ 12 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Storage</h4>
            { this.createVdevs( "data" ) }
          </TWBS.Col>

          {/* SPARE DISKS */}
          <TWBS.Col
            xs={ 12 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Spares</h4>
            { this.createVdevs( "spares" ) }
          </TWBS.Col>
        </TWBS.Row>

      </div>
    );
  }

  }
);

export default TopologyDrawer;
