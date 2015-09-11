// Scrub Task
// ==========
// Modal window to configure or exit a ZFS scrub task.

"use strict";

import React from "react";
import { Input, Popover } from "react-bootstrap";

// import TM from "../../../../flux/middleware/TaskMiddleware";
// import TS from "../../../../flux/stores/TaskStore";

import VS from "../../../../flux/stores/VolumeStore";
import ZM from "../../../../flux/middleware/ZfsMiddleware";


const ScrubModal = React.createClass(
  { getDefaultProps () {
    return { tasks: [] };
  }

  , getInitialState () {
    return { volumes: [] }
  }

  , componentDidMount () {
    VS.addChangeListener( this.handleVolumes );

    ZM.subscribe( this.constructor.displayName );
    ZM.requestVolumes();
  }

  , componentWillUnmount () {
    VS.removeChangeListener( this.handleVolumes );

    ZM.unsubscribe( this.constructor.displayName );
  }

  , handleVolumes () {
    this.setState( { volumes: VS.listVolumes( "name" ) } );
  }

  , createVolumeOptions () {
    var options = [];

    if ( _.has( this, [ "state", "volumes" ] ) ) {
      options = _.map( this.state.volumes
                     , function mapVolumeNameOptions ( volume ) {
                       return (
                         <option
                           value = { volume.name }
                           key = { volume.name }>
                           { volume.name }
                         </option>
                       );
                     }
                     );
    }
    return options;
  }

  , render () {
    return (
      <div>
        <h4>ZFS Scrub</h4>
        <Input type = "select">
          { this.createVolumeOptions() }
        </Input>
      </div>
    );
  }
});

export default ScrubModal
