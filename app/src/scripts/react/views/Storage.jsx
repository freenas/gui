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
import Icon from "../components/Icon";

import ContextDisks from "./Storage/ContextDisks";

import SS from "../../flux/stores/SchemaStore";
import VS from "../../flux/stores/VolumeStore";
import ZM from "../../flux/middleware/ZfsMiddleware";

import Volume from "./Storage/Volume";

const Storage = React.createClass(

  { displayName: "Storage"

  , getInitialState () {
      return (
        { volumes        : VS.listVolumes()
        , selectedDisks  : []
        , selectedSSDs   : []
        , availableDisks : VS.availableDisks
        }
      );
    }

  , componentDidMount () {
      VS.addChangeListener( this.handleUpdatedVS );

      ZM.requestVolumes();
      ZM.requestAvailableDisks();
      ZM.subscribe( this.constructor.displayName );

      EventBus.emit( "showContextPanel", ContextDisks );
    }

  , componentWillUnmount () {
      VS.removeChangeListener( this.handleUpdatedVS );

      ZM.unsubscribe( this.constructor.displayName );

      EventBus.emit( "hideContextPanel", ContextDisks );
    }

  , handleUpdatedVS ( eventMask ) {
      let newState = {};

      switch ( eventMask ) {
        case "volumes":
          newState["volumes"] = VS.listVolumes();
          break;

        case "availableDisks":
          newState["availableDisks"] = VS.availableDisks;
          break;

        default:
          newState["volumes"] = VS.listVolumes();
          newState["availableDisks"] = VS.availableDisks;
          break;
      }

      this.setState( newState );
    }

  , createNewDisk ( path ) {
      return ( { path: path
               , type: "disk"
               , children: []
               }
      );
    }

    // TODO: Accept different types of events, allowing for multiple disks, a
    // variety of disk types and various means of adding disks (drag and drop,
    // multiselect, etc.)
    // TODO: Reasonable recommendations (both initial and changed as needed) for
    // Different numbers of disks.
  , handleDiskAdd ( volumeKey, vdevPurpose, vdevKey, event ) {
      let newSelectedDisks = this.state.selectedDisks;
      let newVolumes = this.state[ "volumes" ];
      let newVdev = this.state[ "volumes" ]
                              [ volumeKey ]
                              [ "topology" ]
                              [ vdevPurpose ]
                              [ vdevKey ];

      switch ( newVdev.type ) {
        // All non-disk vdevs will just need the new disk added to their children.
        case "raidz3" :
        case "raidz2" :
        case "raidz1" :
        case "mirror" :
          newVdev.children.push( this.createNewDisk( event.target.value ) );
          break;

        case "disk" :
          newVdev.type = "mirror";
          newVdev.children = [ this.createNewDisk( newVdev.path )
                             , this.createNewDisk( event.target.value )
                             ];
          newVdev.path = null;
          break;

        // Fresh Vdev with no type becomes a disk and obtains the target as its
        // path.
        default:
          newVdev = this.createNewDisk( event.target.value );
          break;
      }

      newVolumes[ volumeKey ][ "topology" ][ vdevPurpose ][ vdevKey ] = newVdev;

      // Last-second bailout if the disk path is invalid
      if ( _.any( VS.availableDisks
                , function checkAvailableDisks ( disk ) {
                  return ( disk === event.target.value );
                }
                , this
                )
         ) {

        newSelectedDisks.push( event.target.value );
        newSelectedDisks = newSelectedDisks.sort();

        this.setState( { volumes: newVolumes
                       , selectedDisks: newSelectedDisks
                       }
                     );
      }

    }

  , handleDiskRemove ( volumeKey, vdevPurpose, vdevKey, diskPath ) {
      let newSelectedDisks = [];

      let newVolumes = this.state[ "volumes" ];
      let newVdev = this.state[ "volumes" ]
                              [ volumeKey ]
                              [ "topology" ]
                              [ vdevPurpose ]
                              [ vdevKey ];

      switch ( newVdev.type ) {

        case "raidz3" :
          if ( newVdev.children.length === 5 ) {
            newVdev.children = _.without( newVdev.children, diskPath );
            newVdev.type = "raidz2";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "raidz2" :
          if ( newVdev.children.length === 4 ) {
            newVdev.children = _.without( newVdev.children, diskPath );
            newVdev.type = "raidz1";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "raidz1" :

          if ( newVdev.children.length === 3 ) {
            newVdev.children = _.without( newVdev.children, diskPath );
            newVdev.type = "mirror";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "mirror" :
          if ( newVdev.children.length === 2 ) {
            newVdev.path = _.without( newVdev.children, diskPath )[0][ "path" ];
            newVdev.children = [];
            newVdev.type = "disk";
          } else {
            newVdev.children = _.without( newVdev.children, diskPath );
          }
          break;

        case "disk" :
          newVdev.children = [];
          newVdev.path = null;
          newVdev.type = null;
          break;

        default:
          break;
      }

      newVolumes[ volumeKey ][ "topology" ][ vdevPurpose ][ vdevKey ] = newVdev;
      newSelectedDisks = _.without( this.state.selectedDisks, diskPath );

      this.setState( { volumes: newVolumes
                     , selectedDisks: newSelectedDisks
                     }
                   );
    }

  // This is exclusively for adding a new, empty vdev at the top level of a
  // volume topology. Adding new disks is handled by 'handleDiskAdd' and
  // 'createNewDisk'.
  , handleVdevAdd ( volumeKey, vdevPurpose ) {
      let newVolumes = this.state[ "volumes" ];

      // This will be more sophisticated in the future.
      let newVdev = { children : []
                    , path     : null
                    , type     : null
                    };

      if ( !newVolumes[ volumeKey ][ "topology" ][ vdevPurpose ] ) {
        newVolumes[ volumeKey ][ "topology" ][ vdevPurpose ] = [];
      }

      newVolumes[ volumeKey ][ "topology" ][ vdevPurpose ].push( newVdev );

      this.setState( { volumes: newVolumes } );
    }

  , handleVdevRemove ( event, volumeKey, vdevKey ) {
      console.log( "handleVdevRemove", event, volumeKey, vdevKey );
    }

  , handleVdevTypeChange ( event, volumeKey, vdevKey, newVdevType ) {
      console.log(
        "handleVdevTypeChange"
        , event
        , volumeKey
        , vdevKey
        , newVdevType
      );
    }

  , handleVolumeAdd ( event ) {
      let newVolumes = this.state[ "volumes" ];

      newVolumes.push( this.generateFreshVolume() );

      this.setState( { volumes: newVolumes } );
    }

  , handleVolumeReset ( event, volumeKey ) {
      let newVolumes = this.state[ "volumes" ];

      newVolumes[ volumeKey ] = this.generateFreshVolume();

      this.setState( { volumes: newVolumes } );
    }

  , handleVolumeNameChange ( volumeKey, event ) {
      let newVolumes = this.state[ "volumes" ];

      newVolumes[ volumeKey ][ "name" ] = event.target.value;

      this.setState( { volumes: newVolumes } );
    }

  // TODO: Validate against the actual schema
  // TODO: Remove read-only fields and anything that should not be submitted
  // with a new volume. These are not necessarily listed in the schema yet.
  , submitVolume ( volumeKey, event ) {
      ZM.submitVolume( this.state.volumes[ volumeKey ] );
    }

  , generateFreshVolume () {
      return ( { topology   : { data  : []
                              , logs  : []
                              , cache : []
                              , spares : []
                              }
               , properties : { free      : 0
                              , allocated : 0
                              , size      : 0
                              }
               , type: "zfs" // This will never change for a ZFS volume
               , name: ""
               }
             );
    }

  , createVolumes () {
      const volumeCommon =
        { handleDiskAdd          : this.handleDiskAdd
        , handleDiskRemove       : this.handleDiskRemove
        , handleVdevAdd          : this.handleVdevAdd
        , handleVdevRemove       : this.handleDiskRemove
        , handleVdevTypeChange   : this.handleVdevTypeChange
        , handleVolumeReset      : this.handleVolumeReset
        , handleVolumeNameChange : this.handleVolumeNameChange
        , submitVolume           : this.submitVolume
        , availableDisks:
          _.without( VS.availableDisks, ...this.state.selectedDisks )
        , availableSSDs: [] // FIXME: Implement SSDs
        // This must be submitted in full because it is also necessary to know
        // which vdevs of an existing volume were added in editing and which
        // already existed and thus may not be deleted.
        , volumesOnServer        : VS.listVolumes()
        };

      let pools =
        this.state.volumes.map( function ( volume, index ) {
          let { data, logs, cache } = volume.topology;
          let { free, allocated, size } = volume.properties;

          let spares = volume.topology[ "spares" ] || [];

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
        }.bind( this ) );

      if ( this.state.selectedDisks ) {
        // If there are disks available, a new pool may be created. The Volume
        // component is responsible for displaying the correct "blank start"
        // behavior, depending on its knowledge of other pools.
        pools.push(
          <Volume
            { ...volumeCommon }
            blankVolume
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
            <div className="clearfix storage-first-pool">
              <img src="img/hdd.png" />
              <h3>ZFS Pools</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
            </div>
          );
          content = this.createVolumes();
        }
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
