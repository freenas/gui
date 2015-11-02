// ZFS POOLS AND VOLUMES - STORAGE
// ===============================
// This view is defined by vertical stripes in the Storage page. It contains
// depictions of all active pools, pools which have not yet been imported, and
// also the ability to create a new storage pool. The boot pool is explicitly
// excluded from this view.

"use strict";

import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Motion, spring } from "react-motion";

// ACTIONS
import * as DISKS from "../actions/disks";
import * as VOLUMES from "../actions/volumes";
import * as SHARES from "../actions/shares";
import * as SUBSCRIPTIONS from "../actions/subscriptions";

// UTILITY
import { ghost, ghostUpdate } from "../utility/motions";
import VolumeUtilities from "../utility/VolumeUtilities";

// COMPONENTS
import ConfirmationDialog from "../components/ConfirmationDialog";
import CreateStorage from "./Storage/CreateStorage";
import Volume from "./Storage/Volume";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Storage.less" );


// REACT
class Storage extends React.Component {

  constructor( props ) {
    super( props );

    this.displayName = "Storage";
  }

  componentDidMount () {
    this.props.subscribe( this.displayName );

    this.props.fetchData();
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
  }

  componentDidUpdate () {
    // FIXME: Oh god, it burns, it burrrrns
    this.props.fetchAvailableDisksIfNeeded()
  }

  // RENDER METHODS
  renderVolumes () {
    const { volumes } = this.props;

    const ALL_VOLUMES = Object.assign( {}, volumes.serverVolumes, volumes.clientVolumes );
    const VOLUME_IDS = Object.keys( ALL_VOLUMES );

    return VOLUME_IDS.map( ( id, index ) => {
      const { datasets, shares, ...volumeData } = ALL_VOLUMES[ id ];

      return (
        <Volume
          { ...volumeData }
          key = { index }
          active = { id === volumes.activeVolume }
          existsOnServer = { Boolean( volumes.serverVolumes[ id ] ) }
          existsOnClient = { Boolean( volumes.clientVolumes[ id ] ) }

          onDiskSelect = { this.props.onDiskSelect }
          onDiskDeselect = { this.props.onDiskDeselect }

          // DATASETS
          shares = { this.props.shares }
          datasets = { VolumeUtilities.normalizeDatasets( datasets ) }
          rootDataset = { VolumeUtilities.getRootDataset( datasets, volumeData.name ) }

          // DISKS
          disks = { this.props.disks }
          availableDisks = { this.props.availableDisks }
          SSDs = { this.props.SSDs }
          HDDs = { this.props.HDDs }
          availableSSDs = { this.props.availableSSDs }
          availableHDDs = { this.props.availableHDDs }

          // VOLUMES
          onUpdateVolume = { this.props.onUpdateVolume.bind( this, id ) }
          onRevertVolume = { this.props.onRevertVolume.bind( this, id ) }
          onSubmitVolume = { this.props.onSubmitVolume.bind( this, id ) }
          onRequestDestroyVolume = { this.props.onRequestDestroyVolume.bind( this, id ) }

          // SHARES
          onUpdateShare = { this.props.onUpdateShare.bind( this, id ) }
          onRevertShare = { this.props.onRevertShare.bind( this, id ) }
          onSubmitShare = { this.props.onSubmitShare.bind( this, id ) }
          onRequestDeleteShare = { this.props.onRequestDeleteShare.bind( this, id ) }

          // GUI
          onFocusVolume = { this.props.onFocusVolume.bind( this, id ) }
          onFocusShare = { this.props.onFocusShare }
          onBlurShare = { this.props.onBlurShare }
          onBlurVolume = { this.props.onBlurVolume.bind( this, id ) }
          onToggleShareFocus = { this.props.onToggleShareFocus.bind( this, id ) }
        />
      );
    });
  }

  render () {
    const SERVER_VOLUMES_EXIST =
      Boolean( Object.keys( this.props.volumes.serverVolumes ).length );
    const CLIENT_VOLUMES_EXIST =
      Boolean( Object.keys( this.props.volumes.clientVolumes ).length );

    const LOADING = Boolean( this.props.volumes.volumesRequests.size );
    const SHOW_INTRO = !LOADING && !SERVER_VOLUMES_EXIST && !CLIENT_VOLUMES_EXIST;
    // In the case that no volumes are being edited or created, and disks are
    // available for inclusion in a new pool, the user has the option to
    // create a new pool.
    const SHOW_NEW = !LOADING && !CLIENT_VOLUMES_EXIST && this.props.availableDisks.size;

    const TO_DESTROY = this.props.volumeToDestroy
                     ? this.props.volumes.serverVolumes[ this.props.volumeToDestroy ]
                     : "";

    return (
      <main>
        <h1 className="view-header section-heading type-line">
          <span className="text">Storage Volumes</span>
        </h1>

        {/* LOADING SPINNER */}
        <Motion
          defaultStyle = { LOADING ? ghost.defaultIn : ghost.defaultOut }
          style        = { LOADING ? ghost.in : ghost.out }
        >
          { ({ y, opacity }) =>
            <h1
              className = "text-center"
              style = { ghost.update( y, opacity ) }
            >
              LOADING VOLUMES
            </h1>
          }
        </Motion>


        {/* INTRODUCTORY MESSAGE */}
        <Motion
          defaultStyle = { SHOW_INTRO ? ghost.defaultIn : ghost.defaultOut }
          style        = { SHOW_INTRO ? ghost.in : ghost.out }
        >
          { ({ y, opacity }) =>
            <div
              className = "clearfix storage-first-pool"
              style = { ghost.update( y, opacity ) }
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
          }
        </Motion>


        {/* VOLUMES */}
        { this.renderVolumes() }


        {/* CREATE NEW POOL */}
        <CreateStorage
          style = { SHOW_NEW ? {} : { display: "none" } }
          onClick = { this.props.onInitNewVolume }
        />


        {/* CONFIRMATION - POOL DESTRUCTION */}
        <ConfirmationDialog
          show = { Boolean( this.props.volumeToDestroy ) }
          onCancel = { this.props.onCancelDestroyVolume }
          onConfirm = { this.props.onConfirmDestroyVolume }
          confirmStyle = { "danger" }
          title = { "Confirm Destruction of " + TO_DESTROY.name }
          body = {
            <span>
              { "Bro are you like, really really sure you want to do this? "
              + "Once you destroy "}<b>{ TO_DESTROY.name }</b>{" "
              + "it's not coming back. (In other words, I hope you backed up "
              + "your porn.)"
              }
            </span>
          }
          cancel = { "Uhhh no" }
          confirm = { "Blow my pool up fam" }
        />


        {/* CONFIRMATION - SHARE DELETION */}
        <ConfirmationDialog
          show = { Boolean( this.props.shareToDelete ) }
          onCancel = { this.props.onCancelDeleteShare }
          onConfirm = { this.props.onConfirmDeleteShare }
          confirmStyle = { "danger" }
          title = { "Confirm Deletion of " + this.props.shareToDelete }
          body = {
            <span>
              { `Yo this is going to delete ${ this.props.shareToDelete } . All `
              + `the data that was in it will go bye-bye, and nobody will be `
              + `able to access it anymore. You sure that's what you want?`
              }
            </span>
          }
          cancel = { "MY BABY" }
          confirm = { "I didn't like that share anyways" }
        />

      </main>
    );
  }

}

Storage.propTypes =
  { volumes: React.PropTypes.object
  , disks: React.PropTypes.object
  , tasks: React.PropTypes.object

  , SSDs: React.PropTypes.instanceOf( Set ).isRequired
  , HDDs: React.PropTypes.instanceOf( Set ).isRequired

  // SUBSCRIPTIONS
  , subscribe: React.PropTypes.func.isRequired
  , unsubscribe: React.PropTypes.func.isRequired

  // REQUESTS
  , fetchData: React.PropTypes.func.isRequired

  // HANDLERS
  , onConfirmDestroyVolume: React.PropTypes.func.isRequired
  , onCancelDestroyVolume: React.PropTypes.func.isRequired
  , onConfirmDeleteShare: React.PropTypes.func.isRequired
  , onCancelDeleteShare: React.PropTypes.func.isRequired
  };


// REDUX
const SUB_MASKS =
  [ "entity-subscriber.volumes.changed"
  , "entity-subscriber.disks.changed"
  , "entity-subscriber.shares.changed"
  ];

function mapStateToProps ( state ) {
  return (
    { disks: state.disks.disks
    , volumes: state.volumes
    , volumeToDestroy: state.volumes.volumeToDestroy
    , shares: state.shares
    , activeTasks: state.volumes.activeTasks
    , tasks: state.tasks.tasks
    , availableDisks: state.volumes.availableDisks
    , SSDs: state.disks.SSDs
    , HDDs: state.disks.HDDs
    , availableSSDs:
      Array.from( state.disks.SSDs )
           .filter( path => state.volumes.availableDisks.has( path ) )
    , availableHDDs:
      Array.from( state.disks.HDDs )
           .filter( path => state.volumes.availableDisks.has( path ) )
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    // SUBSCRIPTIONS
    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    // INITIAL DATA REQUEST
    , fetchData: () => {
        dispatch( DISKS.requestDiskOverview() )
        dispatch( VOLUMES.fetchVolumes() )
        dispatch( VOLUMES.fetchAvailableDisks() )
        dispatch( SHARES.fetchShares() )
      }

    // FIXME: *wet farting noises*
    , fetchAvailableDisksIfNeeded: () =>
      dispatch( VOLUMES.fetchAvailableDisksIfNeeded() )

    // MODIFY VOLUME ON GUI
    , onInitNewVolume: () =>
      dispatch( VOLUMES.initNewVolume() )
    , onUpdateVolume: ( volumeID, patch ) =>
      dispatch( VOLUMES.updateVolume( volumeID, patch ) )
    , onRevertVolume: ( volumeID ) =>
      dispatch( VOLUMES.revertVolume( volumeID ) )

    // SUBMIT VOLUME
    , onSubmitVolume: ( volumeID ) =>
      dispatch( VOLUMES.submitVolume( volumeID ) )

    // DESTROY VOLUME
    , onRequestDestroyVolume: ( volumeID ) =>
      dispatch( VOLUMES.intendDestroyVolume( volumeID ) )
    , onConfirmDestroyVolume: () =>
      dispatch( VOLUMES.confirmDestroyVolume() )
    , onCancelDestroyVolume: () =>
      dispatch( VOLUMES.cancelDestroyVolume() )

    // CREATE SHARE
    , onUpdateShare: ( volumeID, shareID, patch ) =>
      dispatch( SHARES.updateShare( volumeID, shareID, patch ) )
    , onRevertShare: ( volumeID, shareID ) =>
      dispatch( SHARES.revertShare( volumeID, shareID ) )
    , onSubmitShare: ( volumeID, shareID ) =>
      dispatch( SHARES.submitShare( volumeID, shareID ) )

    // DELETE SHARE
    , onRequestDeleteShare: ( volumeID, shareID ) => console.log( "fart" )
    , onConfirmDeleteShare: ( volumeID ) => console.log( "fart" )
    , onCancelDeleteShare: ( volumeID ) => console.log( "fart" )

    // GUI
    , onDiskSelect: ( path ) =>
      dispatch( VOLUMES.selectDisk( path ) )
    , onDiskDeselect: ( path ) =>
      dispatch( VOLUMES.deselectDisk( path ) )
    , onFocusShare: ( shareID ) =>
      dispatch( SHARES.focusShare( shareID ) )
    , onBlurShare: () =>
      dispatch( SHARES.blurShare() )
    , onFocusVolume: ( volumeID ) =>
      dispatch( VOLUMES.focusVolume( volumeID ) )
    , onBlurVolume: ( volumeID ) =>
      dispatch( VOLUMES.blurVolume( volumeID ) )
    , onToggleShareFocus: ( volumeID ) => console.log( "fart" )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Storage );
