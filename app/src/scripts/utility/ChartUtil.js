// WIDGET UTILITIES
// ================

"use strict";

class WidgetUtil {
  static rand ( min, max, num ) {
    let rtn = [];
    while ( rtn.length < num ) {
      rtn.push( ( Math.random() * ( max - min ) ) + min );
    }
    return rtn;
  }

  static validateCompleteStats ( stats , dataSources , frequency ) {
    // make sure all the dataSources are populated
    var allPopulated = _.all( dataSources
                            , function ( dataSource ) {
                                return stats[ dataSource ];
                              }
                            );

    var timestamps = dataSources.map( function ( dataSource ) {
                                        // timestamps come as unix time in
                                        // milliseconds, but we test against
                                        // time in seconds
                                        return stats[ dataSource ][0] / 1000;
                                      }
                                    );

    // If all the timestamps are within half the period of each other, the
    // stats arrived close enough together to be valid.
    var timestampsInRange = ( _.max( timestamps ) - _.min( timestamps ) )
                            < frequency / 2;

    return allPopulated && timestampsInRange;
  }

}

export default WidgetUtil;
