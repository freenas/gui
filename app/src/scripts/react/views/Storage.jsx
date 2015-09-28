// ZFS POOLS AND VOLUMES - STORAGE
// ===============================
// This view is defined by vertical stripes in the Storage page. It contains
// depictions of all active pools, pools which have not yet been imported, and
// also the ability to create a new storage pool. The boot pool is explicitly
// excluded from this view.

"use strict";

import React from "react";
import { Alert } from "react-bootstrap";

import VS from "../../flux/stores/VolumeStore";
import ZM from "../../flux/middleware/ZfsMiddleware";
import DS from "../../flux/stores/DisksStore";
import DM from "../../flux/middleware/DisksMiddleware";

import Volume from "./Storage/Volume";

var Velocity;

if ( typeof window !== "undefined" ) {
  Velocity = require( "velocity-animate" );
} else {
  // mocked velocity library
  Velocity = function() {
    return Promise().resolve( true );
  };
}

const Storage = React.createClass(

  { displayName: "Storage"

  , getInitialState () {
      return (
        { volumes: VS.listVolumes()
        , devicesAreAvailable: VS.devicesAreAvailable
        , activeVolume: null
        }
      );
    }

  , componentDidMount () {
      VS.addChangeListener( this.handleUpdatedVS );
      DS.addChangeListener( this.handleUpdatedDS );

      DM.requestDisksOverview();
      DM.subscribe( this.constructor.displayName );

      ZM.requestVolumes();
      ZM.requestAvailableDisks();
      ZM.subscribe( this.constructor.displayName );
    }

  , componentWillUnmount () {
      VS.removeChangeListener( this.handleUpdatedVS );
      DS.removeChangeListener( this.handleUpdatedDS );

      DM.unsubscribe( this.constructor.displayName );

      ZM.unsubscribe( this.constructor.displayName );
    }

  , componentDidUpdate ( prevProps, prevState ) {
      if ( ( this.state.volumes.length === 0 )
        && ( this.state.activeVolume !== prevState.activeVolume )
         ) {
        Velocity( React.findDOMNode( this.refs.newPoolMessage )
          , { opacity       : 0
            , height        : 0
            , paddingTop    : 0
            , paddingBottom : 0
            }
          , { display: "none" }
          , 500
          );
      }
    }

  , handleUpdatedVS ( eventMask ) {
      let newState = {};

      switch ( eventMask ) {
        case "availableDisks":
          newState.devicesAreAvailable = VS.devicesAreAvailable;
          break;

        case "volumes":
        default:
          newState.volumes = VS.listVolumes();
          break;
      }

      this.setState( newState );
    }

  , handleUpdatedDS ( eventMask ) {
      // FIXME: Until there's some way to get this information in a more direct
      // way, re-query available disks every time a disk changes. (This should
      // hopefully have the benefit of covering things like ejection, even if
      // it gets triggered by a lot of non-important stuff)
      ZM.requestAvailableDisks();
    }

  , handleVolumeActive ( key ) {
      this.setState({ activeVolume: key });
    }

  , handleVolumeInactive () {
      this.setState({ activeVolume: null });
    }

  , createVolumes () {
      let activeVolume = this.state.activeVolume;

      const VOLUME_HANDLERS =
        { becomeActive   : this.handleVolumeActive
        , becomeInactive : this.handleVolumeInactive
        };

      let pools =
        this.state.volumes.map( function ( volume, index ) {
          return (
            <Volume
              { ...VOLUME_HANDLERS }
              { ...volume }
              existsOnRemote
              key       = { index }
              volumeKey = { index }
              active    = { index === activeVolume }
            />
          );
        });

      if ( this.state.devicesAreAvailable ) {
        // If there are disks available, a new pool may be created. The Volume
        // component is responsible for displaying the correct "blank start"
        // behavior, depending on its knowledge of other pools.
        pools.push(
          <Volume
            { ...VOLUME_HANDLERS }
            key       = { pools.length }
            volumeKey = { pools.length }
            active    = { pools.length === activeVolume }
          />
        );
      } else if ( pools.length === 0 ) {
        // There were no resources, AND no volumes exist on the server. This
        // most likely indicates that the user's system has no disks, the disks
        // are not connected, etc.

        pools.push(
          <Alert
            bsStyle   = "warning"
            className = "volume"
            key = { pools.length }
          >
            { "No volumes were found on the server, and no disks are "
            + "avaialable for inclusion in a new storage pool.\n\n Please shut "
            + "down the system, check your hardware, and try again."
            }
          </Alert>
        );
      }

      return pools;
    }

  , render () {
      let loading = null;
      let message = null;
      let content = null;

      if ( VS.isInitialized ) {
        if ( this.state.volumes.length === 0 ) {
          message = (
            <div
              ref       = "newPoolMessage"
              className = "clearfix storage-first-pool"
            >
              <img src="/images/hdd.png" />
              <h3>Creating Storage</h3>
              <p>
                { "This is the place where you create ZFS pools and stuff. "
                + "Someday, this text will be very helpful and everyone will "
                + "like what it says. Today it just says this, so maybe create "
                + "a pool or something, maaaaaan."
                }
              </p>
            </div>
          );
        }
        content = this.createVolumes();
      } else {
        // TODO: Make this pretty
        loading = <h1 className="text-center">LOADING</h1>;
      }

      return (
        <main>
          <h1 className="section-heading type-line">
            <span className="text">ZFS Storage Pools</span>
          </h1>
          { loading }
          { message }
          { content }
        </main>
      );
    }

  }
);

export default Storage;
