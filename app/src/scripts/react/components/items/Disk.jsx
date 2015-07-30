// DISK ICON
// =========
// Disk icon component. Displays a disk icon, path, and size information.

import React from "react";

import DS from "../../../flux/stores/DisksStore";
import ByteCalc from "../../../utility/ByteCalc";

const Disk = React.createClass(
  { propTypes:
    { path             : React.PropTypes.string.isRequired
    , handleDiskRemove : React.PropTypes.func.isRequired
    , roundMode: React.PropTypes.oneOf(
        [ React.PropTypes.string
        , React.PropTypes.number
        ]
      )
    }

  , getDefaultProps () {
      return { roundMode: "whole" };
    }

  , render () {
    let disk = DS.getByPath( this.props.path );

    return (
      <div className="disk-icon">
        <img src="img/hdd.png" />
        <strong className="primary-text">
          { ByteCalc.humanize( disk.byteSize
                             , { roundMode: this.props.roundMode }
                             )
          }
        </strong>
        <span className="secondary-text">{ this.props.path }</span>
      </div>
    );
  }

});

export default Disk;
