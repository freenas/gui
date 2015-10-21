// DISK UTILITY FUNCTIONS
// ======================

"use strict";

import ByteCalc from "./ByteCalc";

export default class DiskUtilities {
  static createLabel ( disk ) {
    let capacity = ByteCalc.humanize( disk.mediasize, { roundMode: "whole" } );
    let maxRPM = disk.status.max_rotation
               ? ` ${ disk.status.max_rotation }rpm`
               : "";
    let type = disk.status.is_ssd
             ? " SSD"
             : " HDD";

    return capacity + maxRPM + type;
  }

  static similarDisks ( disks ) {
    // Returns arrays of disks based on their self-similarity - determined as
    // the combination of RPM, capacity, type, and manufacturer.
    let SSDs = {};
    let HDDs = {};

    Object.keys( disks ).map( path => {
      const DISK = disks[ path ];
      let label = DiskUtilities.createLabel( DISK );

      if ( DISK.status.is_ssd ) {
        if ( SSDs[ label ] ) {
          SSDs[ label ].push( DISK.path );
        } else {
          SSDs[ label ] = [ DISK.path ];
        }
      } else {
        if ( HDDs[ label ] ) {
          HDDs[ label ].push( DISK.path );
        } else {
          HDDs[ label ] = [ DISK.path ];
        }
      }
    });

    return [ SSDs, HDDs ];
  }
}
