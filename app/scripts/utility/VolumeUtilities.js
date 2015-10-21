// DISK UTILITY FUNCTIONS
// ======================

"use strict";

export default class VolumeUtilities {
  static isDatasetNameBlacklisted ( name, blacklist ) {
    if ( !blacklist ) {
      console.warn( "You must supply a blacklist" );
      return;
    } else if ( !( blacklist instanceof Set ) ) {
      console.warn( "Blacklist must be a set" );
      return;
    }

    if ( blacklist.has( name ) ) {
      // Take advantage of Set string matching capabilities to short circuit
      // non-regexp matches
      return true;
    }

    for ( let entry of blacklist ) {
      // Iterate over the RegExps in the blacklist, and try to match them
      // with the supplied `name` argument
      if ( entry instanceof RegExp && name.match( entry ) ) {
        return true;
      }
    }

    // The string literal was not matched, and none of the RegExp rules
    // triggered a match: The name is not blacklisted
    return false;
  }

  static nestDatasets ( datasets ) {
    if ( !datasets ) {
      // Datasets was definitely not an array
      console.warn( "Expected `datasets` to be an array" );
      return [];
    }

    switch ( datasets.length ) {
      case 0:
        // There are no datasets, return early.
        return [];

      case 1:
        // The only dataset is the root datset, return early.
        return datasets;

      default:
        let poolName;
        let hash  = _.indexBy( datasets, "name" );
        let names = _.pluck( datasets, "name" );

        _.sortBy( names, ( name ) => {
            // Create sorted list of dataset names in accordance of their path
            // lengths, starting with the longest (most nested) paths.
            let slashes = name.match( /\//gi );
            return ( slashes
                   ? ( -1 * slashes.length )
                   : 0
                   );
          })
         .forEach( ( name, index ) => {
            let parentPath = name.replace( /(\/[^\/]*$)/i, "" );

            if ( parentPath === name ) {
              poolName = name;
            } else {
              if ( hash[ parentPath ].children ) {
                hash[ parentPath ].children.push( hash[ name ] );
              } else {
                hash[ parentPath ].children = [ hash[ name ] ];
              }
            }
          });

        return [ hash[ poolName ] ];
    }
  }
}
