// DISK ICON
// =========
// Disk icon component. Displays a disk icon, path, and size information.

import React from "react";

import DS from "../../flux/stores/DisksStore";
import ByteCalc from "../../utility/ByteCalc";


const Disk = ( props ) => {
  const { disk } = props;
  let diskClasses = [ "disk-icon" ];

  switch ( disk.status.smart_status ) {
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

  return (
    <div className= { diskClasses.join( " " ) } >
      <img
        src = { disk.status.is_ssd
              ? "/images/ssd.png"
              : "/images/hdd.png"
              }
      />
      <strong className="primary-text">
        { ByteCalc.humanize( disk.mediasize
                           , { roundMode: props.roundMode }
                           )
        }
      </strong>
      <span className="secondary-text">{ disk.path }</span>
    </div>
  );
}

Disk.propTypes =
  { roundMode: React.PropTypes.oneOfType(
      [ React.PropTypes.string
      , React.PropTypes.number
      ]
    )
  , disk: React.PropTypes.shape(
      { mediasize: React.PropTypes.number.isRequired
      , online: React.PropTypes.bool
      , path: React.PropTypes.string.isRequired
      , serial: React.PropTypes.string
      , status: React.PropTypes.shape(
          { is_ssd: React.PropTypes.bool
          , smart_status: React.PropTypes.string
          }
        )
      }
    )
  };

Disk.defaultProps =
  { roundMode: "whole"
  , status:
    { is_ssd: false
    // TODO: I mean, obviously
    , smart_status: "LOL"
    }
  };

export default Disk;
