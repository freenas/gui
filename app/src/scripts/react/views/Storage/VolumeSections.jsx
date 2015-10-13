// VOLUME SECTION NAV
// ==================
// Simple tablular navigation for controlling the content of Volume's drawer

"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Tabs, Tab } from "react-bootstrap";

import Topology from "./sections/Topology";
import Filesystem from "./sections/Filesystem";
import { Animate, Velocity } from "../../../utility/Animate";

const SECTIONS = [ "files", "filesystem", "snapshots", "topology" ];
const SLIDE_DURATION = 350;

export default class VolumeSections extends React.Component {

  componentDidUpdate ( prevProps, prevState ) {
    if ( this.props.active && !prevProps.active ) {
      // The volume has become active, and the drawer should slide down
    Velocity( ReactDOM.findDOMNode( this.refs.TABS )
            , "slideDown"
            , { duration: SLIDE_DURATION }
            );
    } else if ( !this.props.active && prevProps.active ) {
      // The volume has become inactive, and the drawer should slide up
    Velocity( ReactDOM.findDOMNode( this.refs.TABS )
            , "slideUp"
            , { duration: SLIDE_DURATION }
            );
    }
  }

  render () {
    const { editing, datasets, topology, shares } = this.props;

    return (
      <Tabs
        ref = "TABS"
        className = "volume-nav"
        style     = {{ display: "none" }}
        bsStyle   = "pills"
        activeKey = { this.props.activeSection }
        onSelect  = { this.props.onSelect }
      >

        {/* DATASETS, ZVOLS, AND SHARES */}
        <Tab
          title    = "Shares"
          eventKey = "filesystem"
          disabled = { !datasets || datasets.length === 0 }
        >
          <Filesystem
            { ...this.props.filesystemData }
            handlers = { this.props.filesystemHandlers }
            pool     = { this.props.name }
            editing  = { editing }
            datasets = { datasets }
            shares   = { shares }
          />
        </Tab>

        {/* ZFS SNAPSHOTS */}
        <Tab
          title    = "Snapshots"
          eventKey = "snapshots"
          disabled = { true }
          >
          {/* TODO */}
        </Tab>

        {/* POOL TOPOLOGY */}
        <Tab
          title    = "Pool"
          eventKey = "topology"
        >
          <Topology
            { ...this.props.diskData }
            { ...this.props.topologyHandlers }
            topology = { topology }
            editing  = { editing }
          />
        </Tab>
      </Tabs>
    );
  }
}

VolumeSections.propTypes =
  { activeKey : React.PropTypes.oneOf( SECTIONS )
  , onSelect  : React.PropTypes.func.isRequired

  // GENERAL FLAGS
  , editing : React.PropTypes.bool.isRequired
  , active  : React.PropTypes.bool.isRequired

  // HANDLERS
  , topologyHandlers   : React.PropTypes.object.isRequired
  , filesystemHandlers : React.PropTypes.object.isRequired

  // TOPOLOGY ENTITIES
  , diskData : React.PropTypes.object.isRequired
  , topology : React.PropTypes.object.isRequired

  // FILESYSTEM ENTITIES
  , filesystemData : React.PropTypes.object
  , datasets       : React.PropTypes.array
  , shares         : React.PropTypes.instanceOf( Map )
  };
