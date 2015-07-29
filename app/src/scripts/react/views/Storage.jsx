// ZFS POOLS AND VOLUMES - STORAGE
// ===============================
// This view is defined by vertical stripes in the Storage page. It contains
// depictions of all active pools, pools which have not yet been imported, and
// also the ability to create a new storage pool. The boot pool is explicitly
// excluded from this view.

"use strict";

import _ from "lodash";
import React from "react";
import TWBS from "react-bootstrap";

import EventBus from "../../utility/EventBus";

import ContextDisks from "./Storage/ContextDisks";

import VS from "../../flux/stores/VolumeStore";
import ZM from "../../flux/middleware/ZfsMiddleware";
import DM from "../../flux/middleware/DisksMiddleware";
import DS from "../../flux/stores/DisksStore"

import Volume from "./Storage/Volume";

const Storage = React.createClass(

  { displayName: "Storage"

  , getInitialState () {
      return (
        { volumes       : VS.listVolumes()
        , selectedDisks : new Set()
        , selectedSSDs  : new Set()
        , editingVolume : false
        }
      );
    }

  , componentDidMount () {
      VS.addChangeListener( this.handleUpdatedVS );

      ZM.requestVolumes();
      ZM.requestAvailableDisks();
      ZM.subscribe( this.constructor.displayName );

      DM.requestDisksOverview();
      DM.subscribe( this.constructor.displayName );
    }

  , componentWillUnmount () {
      VS.removeChangeListener( this.handleUpdatedVS );

      ZM.unsubscribe( this.constructor.displayName );

      DM.unsubscribe( this.constructor.displayName );

      EventBus.emit( "hideContextPanel", ContextDisks );
    }

  , componentDidUpdate ( prevProps, prevState ) {
      if ( ( this.state.volumes.length === 0 )
           && ( this.state.editingVolume !== prevState.editingVolume )
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
        case "volumes":
          newState.volumes = VS.listVolumes();
          break;

        case "availableDisks":
          newState.availableDisks = VS.availableDisks;
          break;

        default:
          newState.volumes = VS.listVolumes();
          newState.availableDisks = VS.availableDisks;
          break;
      }

      this.setState( newState );
    }

  , handleEditModeChange ( isEditing, event ) {
      this.setState({ editingVolume: isEditing });

      if ( isEditing ) {
        EventBus.emit( "showContextPanel", ContextDisks );
      } else {
        EventBus.emit( "hideContextPanel", ContextDisks );
      }
    }

  , handleDiskSelection ( path ) {
      let diskUpdate = this.state.selectedDisks;

      diskUpdate.add( path );

      this.setState({ selectedDisks: diskUpdate });
    }

  , handleDiskRemoval ( path ) {
      let diskUpdate = this.state.selectedDisks;

      diskUpdate.delete( path );

      this.setState({ selectedDisks: diskUpdate });
    }

  , createVolumes () {
      const volumeCommon =
        { handleEditModeChange : this.handleEditModeChange
        , handleDiskSelection  : this.handleDiskSelection
        , handleDiskRemoval    : this.handleDiskRemoval
        , availableDisks:
          _.without( VS.availableDisks, ...this.state.selectedDisks )
        , availableSSDs:
          // FIXME: Implement SSDs
          _.without( [], ...this.state.selectedSSDs )
        };

      let pools =
        this.state.volumes.map( function ( volume, index ) {
          let { data, logs, cache } = volume.topology;
          let { free, allocated, size } = volume.properties;

          let spares = volume.topology.spares || [];

          return (
            <Volume
              { ...volumeCommon }
              existsOnRemote
              cache     = { cache }
              logs      = { logs }
              data      = { data }
              spares    = { spares }
              free      = { free.value }
              allocated = { allocated.value }
              size      = { size.value }
              datasets  = { volume.datasets }
              name      = { volume.name }
              volumeKey = { index }
              key       = { index }
            />
          );
        });

      if ( this.state.selectedDisks ) {
        // If there are disks available, a new pool may be created. The Volume
        // component is responsible for displaying the correct "blank start"
        // behavior, depending on its knowledge of other pools.
        pools.push(
          <Volume
            { ...volumeCommon }
            key       = { pools.length }
            volumeKey = { pools.length }
          />
        );
      } else if ( pools.length === 0 ) {
        // There were no resources, AND no volumes exist on the server. This
        // most likely indicates that the user's system has no disks, the disks
        // are not connected, etc.

        pools.push(
          <TWBS.Alert
            bsStyle   = "warning"
            className = "volume"
          >
            { "No volumes were found on the server, and no disks are "
            + "avaialable for inclusion in a new storage pool.\n\n Please shut "
            + "down the system, check your hardware, and try again."
            }
          </TWBS.Alert>
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
              <img src="img/hdd.png" />
              <h3>ZFS Pools</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
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
          { loading }
          { message }
          { content }
        </main>
      );
    }

  }
);

export default Storage;
