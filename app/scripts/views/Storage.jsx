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
import * as SUBSCRIPTIONS from "../actions/subscriptions";

// UTILITY
import { ghost, ghostUpdate } from "../utility/motions";
import VolumeUtilities from "../utility/VolumeUtilities";

// COMPONENTS
import ConfirmationDialog from "../components/ConfirmationDialog";
import CreateStorage from "./Storage/CreateStorage";
import Volume from "./Storage/Volume";
import VolumeTask from "./Storage/VolumeTask";


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

    this.props.fetchDisks();
    this.props.fetchVolumes();
    this.props.fetchAvailableDisks();
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
  }

  // RENDER METHODS
  renderVolumes ( volumeProps ) {
    const { volumes } = this.props;

    const ALL_VOLUMES = Object.assign( {}, volumes.serverVolumes, volumes.clientVolumes );
    const VOLUME_IDS = Object.keys( ALL_VOLUMES );

    return VOLUME_IDS.map( ( id, index ) => {
      return (
        <Volume
          { ...COMMON_PROPS }
          { ...ALL_VOLUMES[ id ] }
          key = { index }
          active = { id === volumes.activeVolume }
          existsOnRemote = { Boolean( volumes.serverVolumes[ id ] ) }

          // VOLUMES
          onDiskSelect = { this.props.onDiskSelect }
          onDiskDeselect = { this.props.onDiskDeselect }
          onCreateVolume = { this.props.onCreateVolume }
          onRevertVolume = { this.props.onRevertVolume }
          onUpdateVolume = { this.props.onUpdateVolume }
          onRequestDeleteVolume = { this.props.onRequestDeleteVolume }

          // SHARES
          onCreateShare = { this.props.onCreateShare }
          onRevertShare = { this.props.onRevertShare }
          onUpdateShare = { this.props.onUpdateShare }
          onRequestDeleteShare = { this.props.onRequestDeleteShare }

          // GUI
          onToggleVolumeFocus = { this.props.onToggleVolumeFocus }
          onToggleShareFocus = { this.props.onToggleShareFocus }
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
    const SHOW_INTRO = !( LOADING && SERVER_VOLUMES_EXIST && CLIENT_VOLUMES_EXIST );
    // In the case that no volumes are being edited or created, and disks are
    // available for inclusion in a new pool, the user has the option to
    // create a new pool.
    const SHOW_NEW = !LOADING && !CLIENT_VOLUMES_EXIST && this.props.volumes.availableDisks.size;

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
          onClick = { () => this.props.onUpdateVolume( "NEW" ) }
        />


        {/* CONFIRMATION - POOL DESTRUCTION */}
        <ConfirmationDialog
          show = { Boolean( this.props.volumeToDelete ) }
          onCancel = { this.props.onCancelDeleteVolume }
          onConfirm = { this.props.onConfirmDeleteVolume }
          confirmStyle = { "danger" }
          title = { "Confirm Destruction of " + this.props.volumeToDelete }
          body = {
            <span>
              { "Bro are you like, really really sure you want to do this? "
              + "Once you destroy "}<b>{ this.props.volumeToDelete }</b>{" "
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

  // SUBSCRIPTIONS
  , subscribe: React.PropTypes.func.isRequired
  , unsubscribe: React.PropTypes.func.isRequired

  // REQUESTS
  , fetchDisks: React.PropTypes.func.isRequired
  , fetchVolumes: React.PropTypes.func.isRequired
  , fetchAvailableDisks: React.PropTypes.func.isRequired

  // HANDLERS
  , onConfirmDeleteVolume: React.PropTypes.func.isRequired
  , onCancelDeleteVolume: React.PropTypes.func.isRequired
  , onConfirmDeleteShare: React.PropTypes.func.isRequired
  , onCancelDeleteShare: React.PropTypes.func.isRequired
  };


// REDUX
const SUB_MASKS =
  [ "entity-subscriber.volumes.changed"
  , "entity-subscriber.disks.changed"
  ];

function mapStateToProps ( state ) {
  return (
    { disks: state.disks
    , volumes: state.volumes
    , tasks: state.tasks
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    // SUBSCRIPTIONS
    { subscribe: ( id ) => dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) => dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    // DISKS
    , fetchDisks: () => dispatch( DISKS.requestDiskOverview() )

    // VOLUMES DATA
    , fetchVolumes: () => dispatch( VOLUMES.fetchVolumes() )
    , fetchAvailableDisks: () => dispatch( VOLUMES.fetchAvailableDisks() )
    , onDiskSelect: () => console.log( "fart" )
    , onDiskDeselect: () => console.log( "fart" )

    // SUBMIT VOLUME
    , onUpdateVolume: () => console.log( "fart" )
    , onSubmitVolume: () => console.log( "fart" )
    , onRevertVolume: () => console.log( "fart" )

    // DESTROY VOLUME
    , onRequestDeleteVolume: () => console.log( "fart" )
    , onConfirmDeleteVolume: () => console.log( "fart" )
    , onCancelDeleteVolume: () => console.log( "fart" )


    // CREATE SHARE
    , onUpdateShare: () => console.log( "fart" )
    , onSubmitShare: () => console.log( "fart" )
    , onRevertShare: () => console.log( "fart" )

    // DELETE SHARE
    , onRequestDeleteShare: () => console.log( "fart" )
    , onConfirmDeleteShare: () => console.log( "fart" )
    , onCancelDeleteShare: () => console.log( "fart" )


    // GUI
    , onToggleVolumeFocus: () => console.log( "fart" )
    , onToggleShareFocus: () => console.log( "fart" )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Storage );
