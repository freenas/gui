// ZFS POOL / VOLUME ITEM
// ======================
// Individual item which represents a ZFS pool and its associated volume.
// Contains the datasets, ZVOLs, and other high level objects that are
// properties of the pool.

"use strict";

import _ from "lodash";
import React from "react";
import { Panel, Tabs, Tab, Alert } from "react-bootstrap";

import EventBus from "../../utility/EventBus";
import ByteCalc from "../../utility/ByteCalc";
import ZfsUtil from "./utility/ZfsUtil";

import NewVolume from "./headers/NewVolume";
import ExistingVolume from "./headers/ExistingVolume";
import Topology from "./sections/Topology";
import Sharing from "./sections/Sharing";


export default class Volume extends React.Component {

  constructor( props ) {
    super( props );

    this.displayName = "Volume";
  }

  getAllowedSections () {
    let allowedSections = new Set();

    // Prerequisites for a healthy pool
    if ( this.props.topology && this.props.datasets ) {
      // TODO
      if ( false ) {
        allowedSections.add( "files" );
      }

      if ( this.props.existsOnServer ) {
        allowedSections.add( "shares" );
      }

      // TODO
      if ( false ) {
        allowedSections.add( "snapshots" );
      }

      allowedSections.add( "topology" );
    }

    return allowedSections;
  }


  // ZFS TOPOLOGY FUNCTIONS
  // ======================
  vdevOperation( opType, key, purpose, options = {} ) {
    let collection  = this.props.topology[ purpose ];
    let targetVdev  = collection[ key ];
    let currentType = null;
    let disks       = opType === "add" && options.path
                    ? [ options.path ]
                    : [];
    const diskPaths = ZfsUtil.getMemberDiskPaths( targetVdev );
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
          diskPaths.forEach( path => {
            this.props.onDiskDeselect( path );
          });
          break;

        case "changeType":
          currentType = options.type;
          disks.push( ...ZfsUtil.getMemberDiskPaths( targetVdev ) );
          break;
      }
    }

    newTopologySection =
      ZfsUtil.reconstructVdev( key, purpose, collection, disks, currentType );

    this.props.onUpdateVolume(
      { topology: Object.assign( {}, this.props.topology, newTopologySection )
      }
    );
  }

  handleDiskAdd ( vdevKey, vdevPurpose, path ) {
    this.props.onDiskSelect( path );
    this.vdevOperation( "add", vdevKey, vdevPurpose, { path: path } );
  }

  handleDiskRemove ( vdevKey, vdevPurpose, path, event ) {
    this.props.onDiskDeselect( path );
    this.vdevOperation( "remove", vdevKey, vdevPurpose, { path: path } );
  }

  handleVdevNuke ( vdevKey, vdevPurpose, event ) {
    this.vdevOperation( "nuke", vdevKey, vdevPurpose );
  }

  handleVdevTypeChange ( vdevKey, vdevPurpose, vdevType, event ) {
    this.vdevOperation( "changeType", vdevKey, vdevPurpose, { type: vdevType } );
  }

  breakdownFromRootDataset () {
    let breakdown;

    if ( this.props.rootDataset ) {
      const PROPERTIES = this.props.rootDataset.properties;

      breakdown =
        { used   : ByteCalc.convertString( PROPERTIES.used.rawvalue )
        , avail  : ByteCalc.convertString( PROPERTIES.available.rawvalue )
        , parity : ZfsUtil.calculateBreakdown( this.props.topology.data
                                             , this.props.disks
                                             ).parity
      }
    } else {
      breakdown = { used: 0, avail: 0, parity: 0 };
      console.warn( `The root dataset for ${ this.props.name } does not `
                  + `seem to exist`
                  );
    }

    return breakdown;
  }

  isSubmissionDisabled () {
    if ( this.props.topology.data.length === 0 ) return true;
    if ( this.props.name.length === 0 ) return true;
  }


  // RENDER METHODS
  // ==============
  render () {
    const ALLOWED_SECTIONS = this.getAllowedSections();
    const DEFAULT_SECTION = ALLOWED_SECTIONS.values().next().value;

    let panelClass = [ "volume" ];

    if ( this.props.active ) { panelClass.push( "active" ); }

    return (
      <Panel className = { panelClass.join( " " ) } >

        {/* VOLUME HEADER */}
        { this.props.existsOnServer ? (
          <ExistingVolume
            volumeName = { this.props.name }
            onClick = { this.props.onFocusVolume }
            onDestroyPool = { this.props.onRequestDestroyVolume }
            topologyBreakdown = { this.breakdownFromRootDataset() }
          />
        ) : (
          <NewVolume
            volumeName = { this.props.name }
            disableSubmit = { this.isSubmissionDisabled() }
            topologyBreakdown = {
              ZfsUtil.calculateBreakdown( this.props.topology.data
                                        , this.props.disks
                                        )
            }
            onVolumeNameChange = { ( name ) => this.props.onUpdateVolume({ name }) }
            onSubmitClick = { this.props.onSubmitVolume }
            onCancelClick = { () => {
              this.props.onBlurVolume();
              this.props.onRevertVolume();
            }}
          />
        ) }

        <Tabs
          className = "volume-nav"
          bsStyle = "pills"
          defaultActiveKey = { DEFAULT_SECTION }
          style = { ( this.props.active && ALLOWED_SECTIONS.size )
                  ? {}
                  : { display: "none" }
                  }
        >

          {/* DATASETS, ZVOLS, AND SHARES */}
          <Tab
            title    = "Shares"
            eventKey = "shares"
            disabled = { !ALLOWED_SECTIONS.has( "shares" ) }
          >
            { ALLOWED_SECTIONS.has( "shares" ) ? (
              <Sharing
                datasets = { this.props.datasets }
                shares = { this.props.shares }
                rootDataset = { this.props.rootDataset }
                onFocusShare = { this.props.onFocusShare }
                onBlurShare = { this.props.onBlurShare }
                onUpdateShare = { this.props.onUpdateShare }
                onRevertShare = { this.props.onRevertShare }
                onSubmitShare = { this.props.onSubmitShare }
                onRequestDeleteShare = { this.props.onRequestDeleteShare }
              />
            ) : (
              <noscript />
            )}
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
            { ALLOWED_SECTIONS.has( "topology" ) ? (
              <Topology
                existsOnServer = { this.props.existsOnServer }
                existsOnClient = { this.props.existsOnClient }

                onDiskAdd = { this.handleDiskAdd.bind( this ) }
                onDiskRemove = { this.handleDiskRemove.bind( this ) }
                onVdevNuke = { this.handleVdevNuke.bind( this ) }
                onVdevTypeChange = { this.handleVdevTypeChange.bind( this ) }

                disks = { this.props.disks }
                availableDisks = { this.props.availableDisks }
                SSDs = { this.props.SSDs }
                HDDs = { this.props.HDDs }
                availableSSDs = { this.props.availableSSDs }
                availableHDDs = { this.props.availableHDDs }

                topology = { this.props.topology }
              />
            ) : (
              <noscript />
            )}
          </Tab>
        </Tabs>


        { ALLOWED_SECTIONS.size === 0 ? (
          <Alert
            bsStyle="danger"
            className="volume-error"
          >
            <h4>Critical Pool Error</h4>
            <p>Something is very wrong with your pool. No topology data could be found.</p>
          </Alert>
        ) : (
          <noscript />
        )}

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
  { active: React.PropTypes.bool.isRequired

  , existsOnServer: React.PropTypes.bool.isRequired
  , existsOnClient: React.PropTypes.bool.isRequired

  , onDiskSelect : React.PropTypes.func.isRequired
  , onDiskDeselect : React.PropTypes.func.isRequired

  // DISKS
  , disks: React.PropTypes.object.isRequired
  , availableDisks: React.PropTypes.instanceOf( Set ).isRequired
  , SSDs: React.PropTypes.instanceOf( Set ).isRequired
  , HDDs: React.PropTypes.instanceOf( Set ).isRequired
  , availableSSDs: React.PropTypes.array.isRequired
  , availableHDDs: React.PropTypes.array.isRequired

  // VOLUMES HANDLERS
  , onUpdateVolume : React.PropTypes.func.isRequired
  , onRevertVolume : React.PropTypes.func.isRequired
  , onSubmitVolume : React.PropTypes.func.isRequired
  , onRequestDestroyVolume : React.PropTypes.func.isRequired

  // SHARES HANDLERS
  , onUpdateShare : React.PropTypes.func.isRequired
  , onRevertShare : React.PropTypes.func.isRequired
  , onSubmitShare : React.PropTypes.func.isRequired
  , onRequestDeleteShare : React.PropTypes.func.isRequired

  // GUI HANDLERS
  , onFocusShare : React.PropTypes.func.isRequired
  , onBlurShare : React.PropTypes.func.isRequired
  , onFocusVolume : React.PropTypes.func.isRequired
  , onBlurVolume : React.PropTypes.func.isRequired
  , onToggleShareFocus : React.PropTypes.func.isRequired

  // DATA
  , name: React.PropTypes.string
  , topology: React.PropTypes.shape(
      { data  : React.PropTypes.array.isRequired
      , log   : React.PropTypes.array.isRequired
      , cache : React.PropTypes.array.isRequired
      , spare : React.PropTypes.array.isRequired
      }
    )
  , datasets: React.PropTypes.object
  , properties: React.PropTypes.shape(
      { free      : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
      , allocated : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
      , size      : React.PropTypes.shape( RAW_VALUE_PROPTYPE )
      }
    )
  }
