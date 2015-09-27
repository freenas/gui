// DISK ICON
// =========
// Disk icon component. Displays a disk icon, path, and size information.

import React from "react";

import DS from "../../../flux/stores/DisksStore";
import ByteCalc from "../../../utility/ByteCalc";


const Disk = React.createClass(
  { propTypes:
    { path: React.PropTypes.string.isRequired
    , roundMode: React.PropTypes.oneOfType(
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
    let diskClasses = [ "disk-icon" ];

    let smart_status, mediasize;
    let is_ssd;

    if ( disk ) {
      ( { smart_status, mediasize } = disk );
      ( { is_ssd } = disk.status );

      switch ( smart_status ) {
        case "PASS":
          diskClasses.push( "smart-pass" );
          break;

        case "WARN":
          diskClasses.push( "smart-warn" );
          break;

        case "FAIL":
          diskClasses.push( "smart-fail" );
          break;

        default:
          // TODO: Some kind of thing for when the smart status is unknown?
          break;
      }
    }

    return (
      <div className= { diskClasses.join( " " ) } >
        <img
          src = { is_ssd
                ? "/images/ssd.png"
                : "/images/hdd.png"
                }
        />
        <strong className="primary-text">
          { ByteCalc.humanize( mediasize
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
