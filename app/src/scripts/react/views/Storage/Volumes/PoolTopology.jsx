// TOPOLOGY DRAWER
// ==============
// A section of the Pool/Volume UI that shows the constituent VDEVs which are
// being used for logs, cache, data, and spares.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import VDEV from "./VDEV";

var TopologyDrawer = React.createClass(

  { propTypes:
    { handleDiskAdd        : React.PropTypes.func.isRequired
    , handleDiskRemove     : React.PropTypes.func.isRequired
    , handleVdevTypeChange : React.PropTypes.func.isRequired
    , availableDisks       : React.PropTypes.array.isRequired
    , availableSSDs        : React.PropTypes.array.isRequired
    , data                 : React.PropTypes.array.isRequired
    , logs                 : React.PropTypes.array.isRequired
    , cache                : React.PropTypes.array.isRequired
    , spares               : React.PropTypes.array.isRequired
    , allowedTypes: React.PropTypes.shape(
        { data   : React.PropTypes.array
        , logs   : React.PropTypes.array
        , cache  : React.PropTypes.array
        , spares : React.PropTypes.array
        }
      ).isRequired
    }

  , createVdevs ( purpose ) {
    let sharedProps =
      { purpose              : purpose
      , availableDevices     : null
      , cols                 : null
      , newVdevAllowed       : false
      };

    switch ( purpose ) {
      case "logs":
      case "cache":
        sharedProps.availableDevices = this.props.availableSSDs;
        sharedProps.cols             = 12;
        // Log and Cache currently only allow a single VDEV.
        if ( this.props[ purpose ].length < 1 ) {
          sharedProps.newVdevAllowed = true;
        }
        break;

      case "spares":
        sharedProps.availableDevices = this.props.availableDisks;
        sharedProps.cols             = 12;
        if ( this.props[ purpose ].length < 1 ) {
          sharedProps.newVdevAllowed = true;
        }
        break;
      case "data":
      default:
        sharedProps.availableDevices = this.props.availableDisks;
        sharedProps.cols             = 6;
        sharedProps.newVdevAllowed   = true;
        break;
    }

    let vdevs = this.props[ purpose ].map(
      ( vdev, index ) => {
        // Destructure vdev to avoid passing in props which will not be used.
        let { children, type, path } = vdev;

        return (
          <VDEV { ...sharedProps }
            allowedTypes = { this.props.allowedTypes[ purpose ][ index ] }
            children     = { children }
            type         = { type }
            path         = { path }
            vdevKey      = { index }
            key          = { index }
            handleDiskAdd = { this.props.handleDiskAdd
                                  .bind( null, index, purpose )
                            }
            handleDiskRemove = { this.props.handleDiskRemove
                                     .bind( null, index, purpose )
                               }
            handleTypeChange = { this.props.handleVdevTypeChange
                                     .bind( null, index, purpose )
                               }
          />
        );
      }
    );

    if ( ( sharedProps.availableDevices.length && sharedProps.newVdevAllowed )
         || vdevs.length === 0
       ) {
      // If there are available devices, and the category in question allows the
      // creation of more than one VDEV, the user may create as many as they
      // desire. Eventually, through the act of assigning disks, they'll be left
      // with only populated VDEVs. The OR side of this check covers the case in
      // which there are no devices available and no VDEVs of that type in
      // props. There must always be a VDEV in Winterfell, however, even if it's
      // just going to render a message about "you can't do anything with me".
      vdevs.push(
        <VDEV { ...sharedProps }
          allowedTypes = { [] }
          type         = { null }
          vdevKey      = { vdevs.length }
          key          = { vdevs.length }
          handleDiskAdd = { this.props.handleDiskAdd
                                .bind( null, vdevs.length, purpose )
                          }
          handleDiskRemove = { this.props.handleDiskRemove
                                   .bind( null, vdevs.length, purpose )
                             }
          handleTypeChange = { this.props.handleVdevTypeChange
                                   .bind( null, vdevs.length, purpose )
                             }
        />
      );
    }

    return vdevs;
  }

  , render () {
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
