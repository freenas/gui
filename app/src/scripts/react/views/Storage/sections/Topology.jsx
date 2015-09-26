// TOPOLOGY DRAWER
// ==============
// A section of the Pool/Volume UI that shows the constituent VDEVs which are
// being used for log, cache, data, and spares.

"use strict";

import React from "react";
import { Row, Col } from "react-bootstrap";

import ZfsUtil from "../utility/ZfsUtil";

import VDEV from "./Topology/VDEV";

var Topology = React.createClass(

  { propTypes:
    { onDiskAdd: React.PropTypes.func.isRequired
    , onDiskRemove: React.PropTypes.func.isRequired
    , onVdevNuke: React.PropTypes.func.isRequired
    , onVdevTypeChange: React.PropTypes.func.isRequired
    , data: React.PropTypes.array.isRequired
    , log: React.PropTypes.array.isRequired
    , cache: React.PropTypes.array.isRequired
    , spares: React.PropTypes.array.isRequired
    , editing: React.PropTypes.bool.isRequired
    }

  , createVdevs ( purpose ) {
    let sharedProps =
      { purpose: purpose
      , cols: null
      , newVdevAllowed: false
      };

    switch ( purpose ) {
      case "log":
      case "cache":
        sharedProps.cols             = 12;
        // Log and Cache currently only allow a single VDEV.
        if ( this.props[ purpose ].length < 1 ) {
          sharedProps.newVdevAllowed = true;
        }
        break;

      case "spares":
        sharedProps.cols             = 12;
        if ( this.props[ purpose ].length < 1 ) {
          sharedProps.newVdevAllowed = true;
        }
        break;
      case "data":
      default:
        sharedProps.cols             = 12;
        sharedProps.newVdevAllowed   = true;
        break;
    }

    let vdevs = this.props[ purpose ].map(
      ( vdev, index ) => {
        // Destructure vdev to avoid passing in props which will not be used.
        let { children, type, path } = vdev;

        let members = ZfsUtil.getMemberDiskPaths({ type, path, children });

        let allowedTypes = this.props.editing
                         ? ZfsUtil.getAllowedVdevTypes( members, purpose )
                         : [ type ];
        const boundArgs = [ null, index, purpose ];

        return (
          <VDEV { ...sharedProps }
            allowedTypes = { allowedTypes }
            children     = { children }
            type         = { type }
            path         = { path }
            vdevKey      = { index }
            key          = { index }
            onDiskAdd    = { this.props.onDiskAdd.bind( ...boundArgs ) }
            onDiskRemove = { this.props.onDiskRemove.bind( ...boundArgs ) }
            onVdevNuke   = { this.props.onVdevNuke.bind( ...boundArgs ) }
            onTypeChange = { this.props.onVdevTypeChange.bind( ...boundArgs ) }
          />
        );
      }
    );

    if ( ( this.props.editing && sharedProps.newVdevAllowed )
         || vdevs.length === 0
       ) {
      // If there are available devices, and the category in question allows the
      // creation of more than one VDEV, the user may create as many as they
      // desire. Eventually, through the act of assigning disks, they'll be left
      // with only populated VDEVs. The OR side of this check covers the case in
      // which there are no devices available and no VDEVs of that type in
      // props. There must always be a VDEV in Winterfell, however, even if it's
      // just going to render a message about "you can't do anything with me".
      const boundArgs = [ null, vdevs.length, purpose ];
      vdevs.push(
        <VDEV { ...sharedProps }
          allowedTypes = { [] }
          type         = { null }
          vdevKey      = { vdevs.length }
          key          = { vdevs.length }
          onDiskAdd    = { this.props.onDiskAdd.bind( ...boundArgs ) }
          onDiskRemove = { this.props.onDiskRemove.bind( ...boundArgs ) }
          onVdevNuke   = { this.props.onVdevNuke.bind( ...boundArgs ) }
          onTypeChange = { this.props.onVdevTypeChange.bind( ...boundArgs ) }
        />
      );
    }

    return vdevs;
  }

  , render () {
    return (
      <div
        style = { this.props.style }
        className = "pool-topology"
      >

        <Row>
          {/* LOG AND CACHE DEVICES */}
          <Col
            xs = { 6 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Cache</h4>
            { this.createVdevs( "cache" ) }
          </Col>
          <Col
            xs = { 6 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Log</h4>
            { this.createVdevs( "log" ) }
          </Col>

          {/* STORAGE VDEVS */}
          <Col
            xs={ 12 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Storage</h4>
            { this.createVdevs( "data" ) }
          </Col>

          {/* SPARE DISKS */}
          <Col
            xs={ 12 }
            className = "pool-topology-section"
          >
            <h4 className="pool-topology-header">Spares</h4>
            { this.createVdevs( "spares" ) }
          </Col>
        </Row>
      </div>
    );
  }

  }
);

export default Topology;
