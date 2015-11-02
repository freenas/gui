// DISK UTILITY FUNCTIONS
// ======================

"use strict";

function pathDepth ( path ) {
  // Create sorted list of dataset names in accordance of their path
  // lengths, starting with the longest (most nested) paths.
  const slashes = name.match( /\//gi );
  return ( slashes
         ? ( -1 * slashes.length )
         : 0
         );
}

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

  static nestShares ( shares, rootPath ) {
    if ( !shares || typeof shares !== "object" ) {
      console.warn( "Expected `shares` to be an object" );
      return;
    }

    if ( typeof rootPath !== "string" ) {
      console.warn( "Expected `rootPath` to be a string" );
      return;
    }


    const KEYS = Object.keys( shares );

    if ( KEYS.length ) {
      let keyPath = {};
      let output = {};

      KEYS.forEach( id => {
        keyPath[ shares[ id ].target ] = id;
        output[ id ] = [];
      });

      KEYS.forEach( id => {
        // Strip off the last path segment, returning the parent's path
        const TARGET_PATH = shares[ id ].target;
        const PARENT_PATH = TARGET_PATH.replace( /(\/[^\/]*$)/i, "" );

        if ( PARENT_PATH === rootPath || !PARENT_PATH.startsWith( rootPath ) ) {
          // This is a child of the root dataset, or does not belong to this
          // pool at all.
          return;
        } else {
          // Add this id to the array keyed to its parent
          output[ keyPath[ PARENT_PATH ] ].push( id );
        }
      });

      return output;
    } else {
      // There are no shares, return early.
      return {};
    }
  }

  static getRootDataset ( datasets, poolName ) {
    let rootDataset;

    if ( Array.isArray( datasets ) ) {
      for ( let i = 0; i < datasets.length; i++ ) {
        if ( datasets[i].name === poolName ) {
          rootDataset = datasets[i];
          break;
        }
      }

      return rootDataset;
    } else {
      console.warn( "Expected `datasets` to be an array" );
      return null;
    }
  }

  static normalizeDatasets ( datasets ) {
    let normalized = {};

    if ( Array.isArray( datasets ) ) {
      datasets.forEach( dataset => {
        normalized[ dataset.mountpoint ] = dataset;
      });
    } else {
      console.warn( "Expected `datasets` to be an array" );
    }

    return normalized;
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

        _.sortBy( names, pathDepth )
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
