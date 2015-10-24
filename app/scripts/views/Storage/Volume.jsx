// ZFS POOL / VOLUME ITEM
// ======================
// Individual item which represents a ZFS pool and its associated volume.
// Contains the datasets, ZVOLs, and other high level objects that are
// properties of the pool.

"use strict";

import _ from "lodash";
import React from "react";
import { Panel, Tabs, Tab } from "react-bootstrap";

import EventBus from "../../utility/EventBus";
import ByteCalc from "../../utility/ByteCalc";
import ZfsUtil from "./utility/ZfsUtil";

import NewVolume from "./headers/NewVolume";
import ExistingVolume from "./headers/ExistingVolume";
import Topology from "./sections/Topology";
import Filesystem from "./sections/Filesystem";

const SECTIONS = [ "files", "filesystem", "snapshots", "topology" ];

export default class Volume extends React.Component {

  constructor( props ) {
    super( props );

    this.displayName = "Volume";
  }

  getAllowedSections () {
    let allowedSections = new Set([ "topology" ]);

    if ( this.props.existsOnRemote ) {
      allowedSections.add( "filesystem" );
      // TODO: More logic for other sections (later!)
    }

    return allowedSections;
  }

  getDefaultSection ( allowedSections ) {
    // If the requested section was not allowed, iterate over all sections in
    // order, and make active whichever one is first found to be allowed
    SECTIONS.forEach( ( section ) => {
      if ( allowedSections.has( section ) ) {
        return section;
      }
    });

    // If no sections were allowed, use the last one in the line, which should
    // theoretically be the most fundamental
    return SECTIONS[ SECTIONS.length - 1 ];
  }


  // ZFS TOPOLOGY FUNCTIONS
  // ======================
  handleTopoRequest ( preferences ) {
      const CREATOR_OUTPUT =
        ZfsUtil.createTopology( this.props.diskData.availableSSDs
                              , this.props.diskData.availableHDDs
                              , preferences
                              );

      VAC.replaceDiskSelection( CREATOR_OUTPUT[1] );
      this.setState({ topology: CREATOR_OUTPUT[0] });
    }

  vdevOperation( opType, key, purpose, options = {} ) {
      let collection  = this.state.topology[ purpose ];
      let targetVdev  = collection[ key ];
      let currentType = null;
      let disks       = opType === "add" && options.path
                      ? [ options.path ]
                      : [];
      let newTopologySection;

      if ( targetVdev ) {

        switch ( opType ) {
          case "add":
            currentType = targetVdev.type;
            disks.push( ...ZfsUtil.getMemberDiskPaths( targetVdev ) );
            break;

          case "remove":
            currentType = targetVdev.type;
            disks.push(
              ..._.without( ZfsUtil.getMemberDiskPaths( targetVdev )
                          , options.path
                          )
            );
            break;

          case "nuke":
            VAC.deselectDisks( ZfsUtil.getMemberDiskPaths( targetVdev ) );
            break;

          case "changeType":
            currentType = options.type;
            disks.push( ...ZfsUtil.getMemberDiskPaths( targetVdev ) );
            break;
        }
      }

      newTopologySection =
        ZfsUtil.reconstructVdev( key, purpose, collection, disks, currentType );

      this.setState(
        { topology: Object.assign( this.state.topology, newTopologySection )
        }
      );
    }

  handleDiskAdd ( vdevKey, vdevPurpose, path ) {
      VAC.selectDisks( path );
      this.vdevOperation( "add", vdevKey, vdevPurpose, { path: path } );
    }

  handleDiskRemove ( vdevKey, vdevPurpose, path, event ) {
      VAC.deselectDisks( path );
      this.vdevOperation( "remove", vdevKey, vdevPurpose, { path: path } );
    }

  handleVdevNuke ( vdevKey, vdevPurpose, event ) {
      this.vdevOperation( "nuke", vdevKey, vdevPurpose );
    }

  handleVdevTypeChange ( vdevKey, vdevPurpose, vdevType, event ) {
      this.vdevOperation( "changeType", vdevKey, vdevPurpose, { type: vdevType } );
    }

  resetTopology () {
      VAC.replaceDiskSelection( [] );
      this.setState(
        { topology:
          { data  : []
          , log   : []
          , cache : []
          , spare : []
          }
        , properties:
          { free: { rawvalue: 0 }
          }
        }
      );
    }


  // GENERAL HANDLERS
  // ================
  handleVolumeNameChange ( event ) {
      this.setState({ name: event.target.value });
    }


  // MIDDLEWARE COMMUNICATION
  // ========================
  submitVolume () {
      let { log, cache, data, spare } = this.state.topology;

      let newVolume =
        { topology:
          { log: log
               ? ZfsUtil.unwrapStripe( log )
               : this.props.topology.log
          , cache: cache
                 ? ZfsUtil.unwrapStripe( cache )
                 : this.props.topology.cache
          , data: data
                ? ZfsUtil.unwrapStripe( data )
                : this.props.topology.data
          , spare: spare
                  ? ZfsUtil.unwrapStripe( spare )
                  : this.props.topology.spare
          }
        , type: "zfs"
        , name: this.state.name
              || this.props.name
              || "Volume" + ( this.props.volumeKey + 1 )
        };

      this.props.onVolumeSubmit( newVolume );
    }

  breakdownFromRootDataset () {
    let breakdown;

    if ( this.props.datasets.length ) {
      let rootDataset = _.find( this.props.datasets
                              , { name: this.props.name }
                              ).properties;
      breakdown =
        { used   : ByteCalc.convertString( rootDataset.used.rawvalue )
        , avail  : ByteCalc.convertString( rootDataset.available.rawvalue )
        , parity : ZfsUtil.calculateBreakdown( topology.data ).parity
      }
    } else {
      breakdown = { used: 0, avail: 0, parity: 0 };
      console.warn( `The root dataset for ${ this.props.name } does not `
                  + `seem to exist`
                  );
    }

    return breakdown;
  }

  toggleUnlessActive () {
    if ( !this.props.active ) this.props.onToggleVolumeFocus();
  }

  isSubmissionDisabled () {
    if ( this.props.topology.data.length === 0 ) return true;
    if ( this.props.name.length === 0 ) return true;
  }




  // RENDER METHODS
  // ==============
  render () {
    const ALLOWED_SECTIONS = this.getAllowedSections();
    const DEFAULT_SECTION = this.getDefaultSection( ALLOWED_SECTIONS );

    let panelClass = [ "volume" ];

    if ( this.props.active ) { panelClass.push( "active" ); }

    return (
      <Panel className = { panelClass.join( " " ) } >

        {/* VOLUME HEADER */}
        { this.props.existsOnRemote ? (
          <ExistingVolume
            volumeName = { this.props.name }
            onClick = { this.toggleUnlessActive }
            onDestroyPool = { this.onRequestDeleteVolume }
            topologyBreakdown = { this.breakdownFromRootDataset() }
          />
        ) : (
          <NewVolume
            volumeName = { this.props.name }
            disableSubmit = { this.isSubmissionDisabled() }
            topologyBreakdown = { ZfsUtil.calculateBreakdown( this.props.topology.data ) }
            onVolumeNameChange = { ( name ) => this.props.onUpdateVolume({ name }) }
            onSubmitClick = { this.props.onSubmitVolume }
            onCancelClick = { this.props.onToggleVolumeFocus }
          />
        ) }

        <Tabs
          className = "volume-nav"
          bsStyle = "pills"
          defaultActiveKey = { DEFAULT_SECTION }
        >

          {/* DATASETS, ZVOLS, AND SHARES */}
          <Tab
            title    = "Shares"
            eventKey = "filesystem"
            disabled = { !ALLOWED_SECTIONS.has( "filesystem" ) }
          >

          </Tab>

          {/* ZFS SNAPSHOTS */}
          <Tab
            title    = "Snapshots"
            eventKey = "snapshots"
            disabled = { !ALLOWED_SECTIONS.has( "snapshots" ) }
            >
            {/* TODO */}
          </Tab>

          {/* POOL TOPOLOGY */}
          <Tab
            title    = "Pool"
            eventKey = "topology"
            disabled = { !ALLOWED_SECTIONS.has( "topology" ) }
          >

          </Tab>
        </Tabs>

      </Panel>
    );
  }
}

const RAW_VALUE_PROPTYPE = {
  rawvalue:
    React.PropTypes.oneOfType(
      [ React.PropTypes.string
      , React.PropTypes.number
      ]
    ).isRequired
};

Volume.propTypes =
  { existsOnRemote: React.PropTypes.bool.isRequired

  , onDiskSelect : React.PropTypes.func.isRequired
  , onDiskDeselect : React.PropTypes.func.isRequired

  // VOLUMES HANDLERS
  , onUpdateVolume : React.PropTypes.func.isRequired
  , onRevertVolume : React.PropTypes.func.isRequired
  , onSubmitVolume : React.PropTypes.func.isRequired
  , onRequestDeleteVolume : React.PropTypes.func.isRequired

  // SHARES HANDLERS
  , onUpdateShare : React.PropTypes.func.isRequired
  , onRevertShare : React.PropTypes.func.isRequired
  , onSubmitShare : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired

  // GUI HANDLERS
  , onToggleVolumeFocus : React.PropTypes.func.isRequired
  , onToggleShareFocus : React.PropTypes.func.isRequired

  // DATA
  , name: React.PropTypes.string
  , diskData: React.PropTypes.shape(
      { availableSSDs: React.PropTypes.array.isRequired
      , availableHDDs: React.PropTypes.array.isRequired
      }
    )
  , topology: React.PropTypes.shape(
      { data  : React.PropTypes.array.isRequired
      , log   : React.PropTypes.array.isRequired
      , cache : React.PropTypes.array.isRequired
      , spare : React.PropTypes.array.isRequired
      }
    )
  , datasets: React.PropTypes.array
  , properties: React.PropTypes.shape(
      { free      : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
      , allocated : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
      , size      : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
      }
    )
  }
