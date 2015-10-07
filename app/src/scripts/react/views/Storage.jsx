// ZFS POOLS AND VOLUMES - STORAGE
// ===============================
// This view is defined by vertical stripes in the Storage page. It contains
// depictions of all active pools, pools which have not yet been imported, and
// also the ability to create a new storage pool. The boot pool is explicitly
// excluded from this view.

"use strict";

import React from "react";
import { Alert, Modal, Button } from "react-bootstrap";

import VS from "../../flux/stores/VolumeStore";
import VM from "../../flux/middleware/VolumeMiddleware";
import DS from "../../flux/stores/DisksStore";
import DM from "../../flux/middleware/DisksMiddleware";
import SM from "../../flux/middleware/SharesMiddleware";
import SS from "../../flux/stores/SharesStore";
import TS from "../../flux/stores/TasksStore";

import Volume from "./Storage/Volume";
import VolumeTask from "./Storage/VolumeTask";

var Velocity;

if ( typeof window !== "undefined" ) {
  Velocity = require( "velocity-animate" );
} else {
  // mocked velocity library
  Velocity = function() {
    return Promise().resolve( true );
  };
}

const ACTIVE_TASK_STATES = new Set([ "CREATED", "WAITING", "EXECUTING" ]);

export default class Storage extends React.Component {

  constructor( props ) {
    super( props );

    this.displayName = "Storage";

    this.onChangedVS = this.handleUpdatedVS.bind( this );
    this.onChangedDS = this.handleUpdatedDS.bind( this );
    this.onChangedSS = this.handleUpdatedSS.bind( this );
    this.onChangedTS = this.handleUpdatedTS.bind( this );

    // SET INITIAL STATE
    this.state =
      { volumes          : VS.listVolumes()
      , shares           : SS.shares
      , tasks:
        { "volume.create"  : TS.getTasksByName( "volume.create" )
        , "volume.destroy" : TS.getTasksByName( "volume.destroy" )
        , "volume.update"  : TS.getTasksByName( "volume.update" )
        }
      , SSDsAreAvailable : VS.SSDsAreAvailable
      , HDDsAreAvailable : VS.HDDsAreAvailable
      , availableSSDs    : VS.availableSSDs
      , availableHDDs    : VS.availableHDDs
      , activeVolume     : null
      , volumeToDelete   : null
      , newDataset       : {}
      };
  }

  componentDidMount () {
    VS.addChangeListener( this.onChangedVS );
    DS.addChangeListener( this.onChangedDS );
    SS.addChangeListener( this.onChangedSS );
    TS.addChangeListener( this.onChangedTS );

    DM.subscribe( this.displayName );
    VM.subscribe( this.displayName );
    SM.subscribe( this.displayName );

    DM.requestDisksOverview();
    VM.requestVolumes();
    VM.requestAvailableDisks();
    SM.query();
  }

  componentWillUnmount () {
    VS.removeChangeListener( this.onChangedVS );
    DS.removeChangeListener( this.onChangedDS );
    SS.removeChangeListener( this.onChangedSS );
    TS.removeChangeListener( this.onChangedTS );

    DM.unsubscribe( this.displayName );
    VM.unsubscribe( this.displayName );
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
        newState.SSDsAreAvailable = VS.SSDsAreAvailable;
        newState.HDDsAreAvailable = VS.HDDsAreAvailable;
        newState.availableSSDs    = VS.availableSSDs;
        newState.availableHDDs    = VS.availableHDDs;
        break;

      case "volumes":
      default:
        // HACK: Events don't work right, this is required to make the page
        // update properly, since all the new volume stuff is based on disk
        // availability
        VM.requestAvailableDisks();
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
    VM.requestAvailableDisks();
  }

  handleUpdatedSS ( eventMask ) {
    this.setState({ shares: SS.shares });
  }

  handleUpdatedTS ( taskNamespace ) {
    let newTasks = this.state.tasks;

    switch ( taskNamespace ) {
      case "volume.create":
        newTasks[ "volume.create" ] = TS.getTasksByName( "volume.create" );
        break;

      case "volume.destroy":
        newTasks[ "volume.destroy" ] = TS.getTasksByName( "volume.destroy" );
        break;

      case "volume.update":
        newTasks[ "volume.update" ] = TS.getTasksByName( "volume.update" );
        break;
    }

    this.setState({ tasks: newTasks });
  }


  // VOLUME MIDDLEWARE COMMUNICATION HANDLERS
  handleVolumeSubmit ( newVolume ) {
    VM.submitVolume( newVolume );
  }

  handleVolumeDelete ( name ) {
    VM.destroyVolume( name );
    this.setState({ volumeToDelete: null }); // TODO: temp workaround
  }

  cancelVolumeDelete () {
    this.setState({ volumeToDelete: null });
  }


  // VOLUME RENDER / VISIBILITY MANAGEMENT
  handleVolumeActive ( key ) {
    this.setState({ activeVolume: key });
  }

  handleVolumeInactive () {
    this.setState({ activeVolume: null });
  }

  handleVolumeDeleteConfirmation ( name ) {
    this.setState({ volumeToDelete: name });
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
  findActiveTask( tasks ) {
    return Array.find( tasks, ( task ) => {
      return ACTIVE_TASK_STATES.has( task.state.toUpperCase() );
    });
  }

  createVolumes ( creationActive ) {
    const { activeVolume, volumes, tasks, shares, SSDsAreAvailable
          , HDDsAreAvailable, availableSSDs, availableHDDs } = this.state;

    let renderableVolumes = _.cloneDeep( volumes );

    if ( Object.keys( this.state.newDataset ).length ) {
      // There's content in the newDataset state, so we should patch it in to
      // what we've got from the store
      this.patchDatasetInto( renderableVolumes, this.state.newDataset );
    }

    const COMMON_PROPS =
      { becomeActive   : this.handleVolumeActive.bind( this )
      , becomeInactive : this.handleVolumeInactive.bind( this )
      , onVolumeSubmit : this.handleVolumeSubmit.bind( this )
      , onVolumeDelete : this.handleVolumeDeleteConfirmation.bind( this )
      , tasks
      , shares
      , diskData:
        { SSDsAreAvailable
        , HDDsAreAvailable
        , availableSSDs
        , availableHDDs
        }
      , filesystemHandlers:
        { onShareCreate   : SM.create
        , onShareDelete   : SM.delete
        , onDatasetCreate : VM.createDataset
        , onDatasetUpdate : VM.updateDataset
        , onDatasetDelete : VM.deleteDataset
        , onDatasetChange : this.handleNewDatasetChange.bind( this )
        , onDatasetCancel : this.handleNewDatasetCancel.bind( this )
        , nameIsPermitted : VS.isDatasetNamePermitted
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

    if ( !creationActive && ( HDDsAreAvailable || SSDsAreAvailable ) ) {
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
    }

    return pools;
  }

  render () {
    const TASKS = this.state.tasks;
    const VOLUME_CREATE_TASK = this.findActiveTask( TASKS["volume.create"] );
    const VOLUME_DESTROY_TASK = this.findActiveTask( TASKS["volume.destroy"] );

    let activeTask = null;
    let loading    = null;
    let message    = null;
    let content    = null;
    let warning    = null;

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
      content = this.createVolumes( Boolean( VOLUME_CREATE_TASK ) );
    } else {
      // TODO: Make this pretty
      loading = <h1 className="text-center">LOADING</h1>;
    }

    if ( false ) {
      // TODO: Re-enable this when it makes sense
      // There were no resources, AND no volumes exist on the server. This
      // most likely indicates that the user's system has no disks, the disks
      // are not connected, etc.
      warning = (
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

    return (
      <main>
        <h1 className="view-header section-heading type-line">
          <span className="text">Storage Volumes</span>
        </h1>

        {/* VOLUMES */}
        <div>
          { loading }
          { message }
          <VolumeTask { ...VOLUME_CREATE_TASK } />
          <VolumeTask { ...VOLUME_DESTROY_TASK } />
          { content }
          { warning }
        </div>

        {/* CONFIRMATION DIALOG - POOL DESTRUCTION */}
        <Modal
          show   = { Boolean( this.state.volumeToDelete ) }
          onHide = { this.cancelVolumeDelete.bind( this ) }
        >
          <Modal.Header closebutton>
            <Modal.Title>
              {"Confirm Destruction of " + this.state.volumeToDelete }
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              { "Bro are you like, really really sure you want to do this? "
              + "Once you destroy "}<b>{ this.state.volumeToDelete }</b>{" "
              + "it's not coming back. (In other words, I hope you backed up "
              + "your porn.)"
              }
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={ this.cancelVolumeDelete.bind( this ) }>
              {"Uhhh no"}
            </Button>
            <Button
              bsStyle = { "danger" }
              onClick = { this.handleVolumeDelete.bind( this, this.state.volumeToDelete ) }
            >
              {"Blow my pool up fam"}
            </Button>
          </Modal.Footer>

        </Modal>
      </main>
    );
  }

}
