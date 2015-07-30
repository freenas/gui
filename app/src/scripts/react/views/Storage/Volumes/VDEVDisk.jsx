// VDEVDisk
// ========
// Component for displaying a disk that is a member of an existing or
// in-progress VDEV. In ZFS terms, used to display a special case of the "disk"
// VDEV type where the disk is a child of a VDEV, NOT of a pool topology.

import React from "react";

import DS from "../../../../flux/stores/DisksStore";
import Icon from "../../../components/Icon";
import ByteCalc from "../../../../utility/ByteCalc";

const VDEVDisk = React.createClass(
  { propTypes:
    { path             : React.PropTypes.string.isRequired
    , handleDiskRemove : React.PropTypes.func.isRequired
    , existsOnServer   : React.PropTypes.bool
    }

  , render: function () {
    let deleteButton = null;
    let disk = DS.getByPath( this.props.path );

    if ( !this.props.existsOnServer ) {
      deleteButton = (
        <span
          className = "disk-remove"
          onClick = { this.props.handleDiskRemove
                          .bind( null, this.props.path )
                    }
        >
          <Icon glyph="times" />
        </span>
      );
    }

    return (
      <div className="disk-icon">
        { deleteButton }
        <img src="img/hdd.png" />
        <strong className="primary-text">{ ByteCalc.humanize( disk.byteSize, { roundMode: "whole" } ) }</strong>
        <span className="secondary-text">{ this.props.path }</span>
      </div>
    );
  }

});

export default VDEVDisk;
