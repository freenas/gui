// Contextual Disks Display
// ========================
// A contextual popout for use with the ContextBar component. Displays icons
// for all disks that are not part of a volume so that they may be used for
// new vdev creation.

"use strict";

import React from "react";
import _ from "lodash";
import TWBS from "react-bootstrap";

import SS from "../../../../../flux/stores/SchemaStore";
import DS from "../../../../../flux/stores/DisksStore";
import DM from "../../../../../flux/middleware/DisksMiddleware";
import VS from "../../../../../flux/stores/VolumeStore";
import ZM from "../../../../../flux/middleware/ZfsMiddleware";

import DiscTri from "../../../../components/DiscTri";
import DragTarget from "../../../../components/DragTarget";
import Disk from "../../../../components/items/Disk";

const ContextDisks = React.createClass(
  { displayName: "Pool Topology Context Drawer"

  , getInitialState () {
      let initialState = this.getDisks();

      _.assign( initialState, { diskSchema: SS.getDef( "disk" ) } );

      return initialState;
    }

  , componentDidMount () {
      DS.addChangeListener( this.handleDiskChange );
      DM.subscribe( this.constructor.displayName );
      DM.requestDisksOverview();

      VS.addChangeListener( this.handleDiskChange );

      ZM.subscribe( this.constructor.displayName );

      ZM.requestVolumes();
      ZM.requestAvailableDisks();
    }

  , componentWillUnmount () {
      DS.removeChangeListener( this.handleDiskChange );
      DM.unsubscribe( this.constructor.displayName );

      VS.removeChangeListener( this.handleDiskChange );

      ZM.unsubscribe( this.constructor.displayName );
    }

  , reduceToAvailable ( paths, key, destination ) {
      let available = _.intersection( paths, VS.availableDisks );

      if ( available.length > 0 ) {
        destination[ key ] = available;
      }
    }

  , getDisks () {
      let groupedDisks = DS.similarDisks;

      let SSDs = {};
      let HDDs = {};

      _.forEach( groupedDisks[0], this.reduceToAvailable.bind( null, SSDs ) );
      _.forEach( groupedDisks[1], this.reduceToAvailable.bind( null, HDDs ) );

      return { ssds: groupedDisks[0]
             , hdds: groupedDisks[1]
             };
    }

  , handleDiskChange () {
      this.setState( this.getDisks() );
    }

  , createPaletteSection ( disks, key ) {
      let headerText = key + " (" + disks.length + ")";

      return (
        <DiscTri
          headerShow = { headerText }
          headerHide = { headerText }
          defaultExpanded = { disks.length < 10 }
          key = { key }
        >
          <div className="disk-container">
            { disks.map( ( path, index ) => (
                  <div
                    className = "disk-wrapper"
                    key = { index }
                  >
                    <DragTarget
                      namespace = "disk"
                      payload = { path }
                    >
                      <Disk path={ path } />
                    </DragTarget>
                  </div>
                )
              )
            }
          </div>
        </DiscTri>
      );
    }

  , createDiskPalette ( collection ) {
      if ( _.isEmpty( collection ) ) {
        return null;
      } else {
        return (
          <TWBS.Well>
            { _.map( collection, this.createPaletteSection ) }
          </TWBS.Well>
        );
      }
    }

  , render () {
      let disksHeader = null;
      let availableSSDs = this.createDiskPalette( this.state.ssds );
      let availableHDDs = this.createDiskPalette( this.state.hdds );

      if ( availableSSDs || availableHDDs ) {
        disksHeader = <h4>Available Devices</h4>;
      }

      return (
        <div className="context-disks">
          { disksHeader }
          { availableSSDs }
          { availableHDDs }
        </div>
      );
    }

  }
);

export default ContextDisks;
