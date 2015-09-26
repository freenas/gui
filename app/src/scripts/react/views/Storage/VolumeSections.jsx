// VOLUME SECTION NAV
// ==================
// Simple tablular navigation for controlling the content of Volume's drawer

"use strict";

import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import Topology from "./sections/Topology";
import Filesystem from "./sections/Filesystem";

var Velocity;

if ( typeof window !== "undefined" ) {
  Velocity = require( "velocity-animate" );
} else {
  // mocked velocity library
  Velocity = function() {
    return Promise().resolve( true );
  };
}

const SECTIONS = [ "files", "filesystem", "snapshots", "topology" ];
const SLIDE_DURATION = 350;

export default class VolumeSections extends React.Component {

  componentDidUpdate ( prevProps, prevState ) {
    if ( this.props.active && !prevProps.active ) {
      // The volume has become active, and the drawer should slide down
      this.slideDownDrawer();
    } else if ( !this.props.active && prevProps.active ) {
      // The volume has become inactive, and the drawer should slide up
      this.slideUpDrawer();
    }
  }

  slideDownDrawer () {
    Velocity( React.findDOMNode( this.refs.drawer )
            , "slideDown"
            , { duration: SLIDE_DURATION }
            );
  }

  slideUpDrawer () {
    Velocity( React.findDOMNode( this.refs.drawer )
            , "slideUp"
            , { duration: SLIDE_DURATION }
            );
  }

  render () {
    return (
      <Tabs
        ref       = "drawer"
        className = "volume-nav"
        style     = {{ display: "none" }}
        bsStyle   = "pills"
        activeKey = { this.props.activeSection }
        onSelect  = { this.props.onSelect }
      >
        {/* FILE BROWSER */}
        <Tab
          title    = "Files"
          eventKey = "files"
          disabled = { !this.props.allowedSections.has( "files" ) }
        >
          {/* TODO */}
        </Tab>

        {/* DATASETS, ZVOLS, AND SHARES */}
        <Tab
          title    = "Filesystem"
          eventKey = "filesystem"
          disabled = { !this.props.allowedSections.has( "filesystem" ) }
        >
          <Filesystem />
        </Tab>

        {/* ZFS SNAPSHOTS */}
        <Tab
          title    = "Snapshots"
          eventKey = "snapshots"
          disabled = { !this.props.allowedSections.has( "snapshots" ) }
          >
          {/* TODO */}
        </Tab>

        {/* POOL TOPOLOGY */}
        <Tab
          title    = "Pool Topology"
          eventKey = "topology"
          disabled = { !this.props.allowedSections.has( "topology" ) }
        >
          <Topology
            data             = { this.props.data }
            log              = { this.props.log }
            cache            = { this.props.cache }
            spares           = { this.props.spares }
            onDiskAdd        = { this.props.onDiskAdd }
            onDiskRemove     = { this.props.onDiskRemove }
            onVdevNuke       = { this.props.onVdevNuke }
            onVdevTypeChange = { this.props.onVdevTypeChange }
            editing          = { this.props.editing }
          />
        </Tab>
      </Tabs>
    );
  }
}

VolumeSections.propTypes =
  { activeKey        : React.PropTypes.oneOf( SECTIONS )
  , allowedSections  : React.PropTypes.instanceOf( Set )
  , onSelect         : React.PropTypes.func.isRequired
  , onDiskAdd        : React.PropTypes.func.isRequired
  , onDiskRemove     : React.PropTypes.func.isRequired
  , onVdevNuke       : React.PropTypes.func.isRequired
  , onVdevTypeChange : React.PropTypes.func.isRequired
  , data             : React.PropTypes.array.isRequired
  , log              : React.PropTypes.array.isRequired
  , cache            : React.PropTypes.array.isRequired
  , spares           : React.PropTypes.array.isRequired
  , editing          : React.PropTypes.bool.isRequired
  , active           : React.PropTypes.bool.isRequired
  };
