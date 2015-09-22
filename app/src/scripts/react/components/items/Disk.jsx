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

    if ( disk[ "smart-status" ] === "PASS" ) {
      diskClasses.push( "smart-pass" );
    } else if ( disk[ "smart-status"] === "WARN" ) {
      diskClasses.push( "smart-warn" );
    } else if ( disk[ "smart-status" ] === "FAIL" ) {
      diskClasses.push( "smart-fail" );
    }

    return (
      <div className= { diskClasses.join( " " ) } >
        <img
          src = { disk.status["is_ssd"]
                ? "/images/ssd.png"
                : "/images/hdd.png"
                }
        />
        <strong className="primary-text">
          { ByteCalc.humanize( disk.mediasize
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
