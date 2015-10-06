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
import SM from "../../flux/middleware/SharesMiddleware";
import SS from "../../flux/stores/SharesStore";

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

export default class Storage extends React.Component {

  constructor( props ) {
    super( props );

    this.displayName = "Storage";

    this.onChangedVS = this.handleUpdatedVS.bind( this );
    this.onChangedDS = this.handleUpdatedDS.bind( this );
    this.onChangedSS = this.handleUpdatedSS.bind( this );

    // SET INITIAL STATE
    this.state =
      { volumes             : VS.listVolumes()
      , shares              : SS.shares
      , devicesAreAvailable : VS.devicesAreAvailable
      , activeVolume        : null
      , newDataset          : {}
      };
  }

  componentDidMount () {
    VS.addChangeListener( this.onChangedVS );
    DS.addChangeListener( this.onChangedDS );
    SS.addChangeListener( this.onChangedSS );

    DM.subscribe( this.displayName );
    ZM.subscribe( this.displayName );
    SM.subscribe( this.displayName );

    DM.requestDisksOverview();
    ZM.requestVolumes();
    ZM.requestAvailableDisks();
    SM.query();
  }

  componentWillUnmount () {
    VS.removeChangeListener( this.onChangedVS );
    DS.removeChangeListener( this.onChangedDS );
    SS.removeChangeListener( this.onChangedSS );

    DM.unsubscribe( this.displayName );
    ZM.unsubscribe( this.displayName );
    SM.unsubscribe( this.displayName );
  }

  componentDidUpdate ( prevProps, prevState ) {
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


  // FLUX STORE UPDATE HANDLERS
  handleUpdatedVS ( eventMask ) {
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

  handleUpdatedDS ( eventMask ) {
    // FIXME: Until there's some way to get this information in a more direct
    // way, re-query available disks every time a disk changes. (This should
    // hopefully have the benefit of covering things like ejection, even if
    // it gets triggered by a lot of non-important stuff)
    ZM.requestAvailableDisks();
  }

  handleUpdatedSS ( eventMask ) {
    this.setState({ shares: SS.shares });
  }


  // VOLUME RENDER / VISIBILITY MANAGEMENT
  handleVolumeActive ( key ) {
    this.setState({ activeVolume: key });
  }

  handleVolumeInactive () {
    this.setState({ activeVolume: null });
  }


  // FILESYSTEM AND SHARING HANDLERS
  handleNewDatasetChange ( newAttributes ) {
    this.setState(
      { newDataset: Object.assign( {}, this.state.newDataset, newAttributes )
      }
    );
  }

  handleNewDatasetCancel () {
    this.setState({ newDataset: {} });
  }

  nestDatasets ( datasets ) {
    if ( !datasets ) {
      // Datasets was definitely not an array
      console.warn( "Expected `datasets` to be an array" );
      return [];
    }

    switch ( datasets.length ) {
      case 0:
        // There are no datasets, return early.
        return [];

      case 1:
        // The only dataset is the root datset, return early.
        return datasets;

      default:
        let poolName;
        let hash  = _.indexBy( datasets, "name" );
        let names = _.pluck( datasets, "name" );

        _.sortBy( names, ( name ) => {
            // Create sorted list of dataset names in accordance of their path
            // lengths, starting with the longest (most nested) paths.
            let slashes = name.match( /\//gi );
            return ( slashes
                   ? ( -1 * slashes.length )
                   : 0
                   );
          })
         .forEach( ( name, index ) => {
            let parentPath = name.replace( /(\/[^\/]*$)/i, "" );

            if ( parentPath === name ) {
              poolName = name;
            } else {
              if ( hash[ parentPath ].children ) {
                hash[ parentPath ].children.push( hash[ name ] );
              } else {
                hash[ parentPath ].children = [ hash[ name ] ];
              }
            }
          });

        return [ hash[ poolName ] ];
    }
  }


  // LOCAL STATE PATCHING METHODS
  patchDatasetInto ( volumes, target ) {
    var { pool_name, mountpoint } = target;

    if ( volumes.length === 0 ) {
      console.warn( "Can't patch dataset into volumes: No volumes exist");
    } else if ( !pool_name || typeof mountpoint !== "string" ) {
      console.log( "Both `pool_name` and `mountpoint` must be properties of "
                 + "target when patching"
                 );
    } else {
      let targetVolume = _.findWhere( volumes, { "name": pool_name } );

      if ( !targetVolume ) {
        console.warn( `${ pool_name } could not be found in provided volumes` );
        console.dir( "volumes", volumes );
      } else if ( targetVolume.datasets.length === 0 ) {
        console.warn( `${ pool_name } doesn't have any datasets` );
        console.dir( pool_name, targetVolume );
      } else {
        targetVolume.datasets.push( target );
      }
    }
  }


  // RENDER METHODS
  createVolumes () {
    const { activeVolume, volumes } = this.state;

    let renderableVolumes = _.cloneDeep( volumes );

    if ( Object.keys( this.state.newDataset ).length ) {
      // There's content in the newDataset state, so we should patch it in to
      // what we've got from the store
      this.patchDatasetInto( renderableVolumes, this.state.newDataset );
    }

    const COMMON_PROPS =
      { becomeActive       : this.handleVolumeActive.bind( this )
      , becomeInactive     : this.handleVolumeInactive.bind( this )
      , shares             : this.state.shares
      , filesystemHandlers:
        { onShareCreate       : SM.create
        , onShareDelete       : SM.delete
        , onDatasetCreate     : ZM.createDataset
        , onDatasetUpdate     : ZM.updateDataset
        , onDatasetDelete     : ZM.deleteDataset
        , onDatasetChange     : this.handleNewDatasetChange.bind( this )
        , onDatasetCancel     : this.handleNewDatasetCancel.bind( this )
        , nameIsPermitted     : VS.isDatasetNamePermitted
        }
      };

    let pools =
      renderableVolumes.map( ( volume, index ) => {
        volume.datasets = this.nestDatasets( volume.datasets );
        return (
          <Volume
            { ...COMMON_PROPS }
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
          { ...COMMON_PROPS }
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

  render () {
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
        <h1 className="view-header section-heading type-line">
          <span className="text">Storage Volumes</span>
        </h1>
        { loading }
        { message }
        { content }
      </main>
    );
  }

}
